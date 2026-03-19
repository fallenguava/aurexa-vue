export interface GenerateMonthlyReportQuery {
  pocket_id: string
  month: string
  year: string
}

export interface GenerateMonthlyReportResult {
  url: string
}
