import { AutoMap } from 'nestjsx-automapper';

export class Urls {
  // @AutoMap()
  raw: string;
  // @AutoMap()
  full: string;
  // @AutoMap()
  regular: string;
  // @AutoMap()
  small: string;
  // @AutoMap()
  thumb: string;
}

export class UnsplashModel {
  id: string;

  @AutoMap()
  created_at: Date;
  updated_at: Date;
  promoted_at: Date;
  width: number;
  height: number;
  color: string;
  blur_hash: string;

  @AutoMap()
  description: string;

  alt_description: string;

  @AutoMap(() => Urls)
  urls: Urls;
  links: WelcomeLinks;
  categories: any[];
  likes: number;
  liked_by_user: boolean;
  current_user_collections: any[];
  sponsorship: null;
  user: User;
}

export class WelcomeLinks {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

export class User {
  id: string;
  updated_at: Date;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  twitter_username: null;
  portfolio_url: string;
  bio: string;
  location: string;
  links: UserLinks;
  profile_image: ProfileImage;
  instagram_username: string;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  accepted_tos: boolean;
}

export class UserLinks {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
  following: string;
  followers: string;
}

export class ProfileImage {
  small: string;
  medium: string;
  large: string;
}
