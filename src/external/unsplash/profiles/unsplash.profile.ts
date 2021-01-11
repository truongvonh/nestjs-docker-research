import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { UnsplashResponseDTO } from '../dto/unsplash.dto';
import { UnsplashModel } from '../model/unsplash.model';

@Profile()
export class MerchantProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(UnsplashModel, UnsplashResponseDTO);
  }
}
