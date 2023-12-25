import { Controller, Get } from '@nestjs/common';

@Controller({
  path: 'benchmark',
})
export class BenchmarkController {
  @Get()
  benchmark() {
    return;
  }
}
