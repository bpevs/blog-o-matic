export function middleware(req: any, res: any, next: any) {
  console.log(req, res)
  next()
}
