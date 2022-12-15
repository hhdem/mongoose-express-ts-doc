import Request from "../types/Request";

export default class requestUtils {
  static async getOperateType(req: Request) {
    let type = "update";
    const method = req.method;
    if (method === "GET") {
      type = "view";
    }
    return type;
  }
}
