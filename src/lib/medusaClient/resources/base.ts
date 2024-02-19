import type Client from "./client"

export default class BaseResource {
  public medusa: Client

  constructor(client: Client) {
    this.medusa = client
  }
}