import { HttpClient } from "@angular/common/http";
import { API_URL } from "../api/api-url.token";
import { inject } from "@angular/core";

export abstract class HttpAbstract {
  protected readonly http = inject(HttpClient);

  protected readonly apiUrl = inject(API_URL);
}