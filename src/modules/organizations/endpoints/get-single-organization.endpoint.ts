import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, Param, HttpStatus, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators/auth';
import { DefineResponse } from '@/common/decorators/define-response';
import {
  OrganizationResponseDto,
  OrganizationIdPathParamDto,
} from '@/modules/organizations/dtos/organization.dto';
import { ORGANIZATIONS_TAG } from '@/modules/organizations/organizations.constant';
import { OrganizationsService } from '@/modules/organizations/services/organizations.service';
import { UserType } from '@/modules/users/users.constant';

@Controller()
@ApiTags(ORGANIZATIONS_TAG)
export class GetSingleOrganizationEndpoint {
  constructor(
    private readonly em: EntityManager,
    private readonly organizationService: OrganizationsService,
  ) {}

  @Get('/organizations/:organizationId')
  @ApiOperation({ description: 'Get single organization' })
  @Auth(UserType.ADMIN)
  @DefineResponse(HttpStatus.OK, OrganizationResponseDto)
  async handler(
    @Param() { organizationId }: OrganizationIdPathParamDto,
  ): Promise<OrganizationResponseDto> {
    const organization = await this.organizationService.findOneByIdOrThrow(
      organizationId,
    );

    return new OrganizationResponseDto(organization);
  }
}
