import { HttpStatus } from './lib/responses';
import { NextFunction, Request, Response } from 'express';

export = ChaoticResponse;

declare class ChaoticResponse {
  constructor(options?: ChaoticResponse.ChaoticOptions);

  setMode(mode: ChaoticResponse.Modes): void;

  getMode(): ChaoticResponse.ChaoticModes;

  callbackOnError: () => void;

  middleware(req: Request, res: Response, next: NextFunction): void
}

declare namespace ChaoticResponse {
  type ChaoticModes = {
    responses: HttpStatus[],
    weights: number[]
  }

  type ChaoticOptions = {
    mode?: Modes,
    customMode?: ChaoticResponse.ChaoticModes,
    timeout?: number
  }

  enum Modes {
    OPTIMISTIC = 'optimistic',
    PESSIMISTIC = 'pessimistic',
    TIMEOUT = 'timeout',
    FAILURE = 'failure'
  }
}
