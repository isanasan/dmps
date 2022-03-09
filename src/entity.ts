import parseISO from "https://deno.land/x/date_fns@v2.22.1/parseISO/index.js";

export class PullRequest {
  public leadTimeSeconds: number;
  public timeToMergeSeconds: number;
  public timeToMergeFromFirstReviewSeconds: number | undefined;

  constructor(
    public title: string,
    public author: string,
    public url: string,
    public createdAt: string,
    public mergedAt: string,
    public additions: number,
    public deletions: number,
    public authoredDate: string,
    public firstReviewedAt: string | undefined,
  ) {
    const mergedAtMillis = parseISO(this.mergedAt, null).getTime();
    this.leadTimeSeconds =
      (mergedAtMillis - parseISO(this.authoredDate, null).getTime()) / 1000;
    this.timeToMergeSeconds =
      (mergedAtMillis - parseISO(this.createdAt, null).getTime()) / 1000;
    this.timeToMergeFromFirstReviewSeconds = this.firstReviewedAt
      ? (mergedAtMillis - parseISO(this.firstReviewedAt, null).getTime()) / 1000
      : undefined;
  }
}
