import { Controller } from '@nestjs/common';
import { EmailserviceService } from './emailservice.service';

@Controller()
export class EmailserviceController {
  constructor(private readonly emailserviceService: EmailserviceService) {}
}
