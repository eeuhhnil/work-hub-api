import { Injectable } from "@nestjs/common";
import { DbService } from "src/common/db/db.service";

@Injectable()
export class ProjectService {
  constructor(private db: DbService) {}
}
