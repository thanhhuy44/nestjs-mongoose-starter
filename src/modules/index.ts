import { AssetsModule } from './assets/assets.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { UsersModule } from './users/users.module';

const modules = [CacheModule, UsersModule, AuthModule, AssetsModule];

export default modules;
