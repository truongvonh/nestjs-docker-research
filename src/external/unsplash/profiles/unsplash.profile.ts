import { AutoMapper, mapFrom, Profile, ProfileBase } from 'nestjsx-automapper';
import { UnsplashResponseDTO } from '../dto/unsplash.dto';
import { UnsplashModel, Urls } from '../model/unsplash.model';

@Profile()
export class MerchantProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Urls, Urls);
    mapper.createMap(UnsplashModel, UnsplashResponseDTO).forMember(
      des => des.urls,
      mapFrom(src => src.urls),
    );
  }
}
