import { SetMetadata } from '@nestjs/common';
export const ORG_SCOPE_KEY = 'orgScope';
export const OrgScoped = () => SetMetadata(ORG_SCOPE_KEY, true);
