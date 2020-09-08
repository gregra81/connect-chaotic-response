import { HttpStatus } from './lib/responses';
import { NextFunction, Request, Response } from 'express';

export declare enum Modes {
  OPTIMISTIC = 'optimistic',
  PESSIMISTIC = 'pessimistic',
  TIMEOUT = 'timeout',
  FAILURE = 'failure'
}

export declare interface ChaoticModes {
  responses: HttpStatus[],
  weights: number[]
}

export declare interface ChaoticOptions {
  mode: Modes,
  customMode: ChaoticModes,
  timeout: number
}


export declare class ChaoticResponse {
  constructor(options: ChaoticOptions);

  setMode(mode: Modes): void;
  getMode(): ChaoticModes;
  callbackOnError: () => void;
  middleware(req: Request, res: Response, next: NextFunction): void
}

export declare function ChaoticResponse(options: ChaoticOptions): void
