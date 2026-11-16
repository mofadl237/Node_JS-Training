import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/response.js";
import { UploadsService } from "./service.js";
import type { IProofSignInput, IUploadSignInput } from "./validation.js";

export class UploadsController {
  private service = new UploadsService();

  sign = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const input = req.body as IUploadSignInput;
      const result = this.service.signCatalogAsset(input.kind);
      return ApiResponse.created(res, "Upload signature created", result);
    } catch (error) {
      next(error);
    }
  };

  signProof = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const input = req.body as IProofSignInput;
      const result = await this.service.signProof(input);
      return ApiResponse.created(res, "Upload signature created", result);
    } catch (error) {
      next(error);
    }
  };
}
