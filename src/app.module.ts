import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './database/db.module';
import { UsersModule } from './controllers/users/users.module';
import { GeoLocationsModule } from './controllers/geo_location/geo_locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DBModule,
    UsersModule,
    GeoLocationsModule
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule implements NestModule {
  configure() { }
}
