import {
  ClientError,
  gql,
  GraphQLClient,
} from "https://deno.land/x/graphql_request@v4.1.0/mod.ts";
import { PullRequest } from "./entity.ts";
import parseISO from "https://deno.land/x/date_fns@v2.22.1/parseISO/index.js";

// GitHub.com https://api.github.com/graphql
// GitHub Enterprise https://<HOST>/api/graphql
const GITHUB_GRAPHQL_ENDPOINT = Deno.env.get("GITHUB_ENDPOINT") ||
  "https://api.github.com/graphql";
const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");

if (GITHUB_TOKEN === undefined) {
  console.error("require GITHUB_TOKEN");
  Deno.exit(1);
}

export const graphQLClient = new GraphQLClient(GITHUB_GRAPHQL_ENDPOINT, {
  headers: {
    authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

export function fetchAllMergedPullRequests(
  searchQuery: string,
  startDateString?: string,
  endDateString?: string,
): Promise<PullRequest[]> {
  const startDate = startDateString
    ? parseISO(startDateString, null).toISOString()
    : "";
  const endDate = endDateString
    ? parseISO(endDateString, null).toISOString()
    : "";

  let q = `is:pr is:merged ${searchQuery}`;
  if (startDate !== "" || endDate !== "") {
    q += ` merged:${startDate}..${endDate}`;
  }

  return fetchAllPullRequestsByQuery(q);
}

interface PullRequestNode {
  title: string;
  author: {
    login: string;
  } | null;
  url: string;
  createdAt: string;
  mergedAt: string;
  additions: number;
  deletions: number;
  commits: {
    nodes: {
      commit: {
        authoredDate: string;
      };
    }[];
  };
  reviews: {
    nodes: {
      createdAt: string;
    }[];
  };
}

async function fetchAllPullRequestsByQuery(
  searchQuery: string,
): Promise<PullRequest[]> {
  const query = gql`
    query($after: String) {
      search(type: ISSUE, first: 100, query: "${searchQuery}", after: $after) {
        issueCount
        nodes {
          ... on PullRequest {
            title
            author {
              login
            }
            url
            createdAt
            mergedAt
            additions
            deletions
            # for lead time
            commits(first:1) {
              nodes {
                commit {
                  authoredDate
                }
              }
            }
            # for time to merge from review
            reviews(first:1) {
              nodes {
                ... on PullRequestReview {
                  createdAt
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      rateLimit {
        limit
        cost
        remaining
        resetAt
      }
    }
  `;

  let after: string | undefined;
  let prs: PullRequest[] = [];

  const prMapping = function (data: any): PullRequest[] {
    return prs.concat(
      data.search.nodes.map(
        (p: PullRequestNode) =>
          new PullRequest(
            p.title,
            p.author ? p.author.login : null,
            p.url,
            p.createdAt,
            p.mergedAt,
            p.additions,
            p.deletions,
            p.commits.nodes[0].commit.authoredDate,
            p.reviews.nodes[0] ? p.reviews.nodes[0].createdAt : undefined,
          ),
      ),
    );
  };

  while (true) {
    try {
      const data = await graphQLClient.request(query, { after });
      prs = prMapping(data);
      if (!data.search.pageInfo.hasNextPage) break;
      after = data.search.pageInfo.endCursor;
    } catch (error) {
      if (error instanceof ClientError) {
        switch (error.response.status) {
          case 401:
            console.error(JSON.stringify(error, undefined, 2));
            Deno.exit(1);
        }
      } else {
        console.error(JSON.stringify(error, undefined, 2));
        Deno.exit(1);
      }
    }
  }

  return prs;
}
