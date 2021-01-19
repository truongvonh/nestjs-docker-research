export enum ERRORS_MESSAGE {
  USER_EXISTED = 'User existed!',
  USER_NOT_FOUND = 'User not found!',
  ENTITY_NOT_FOUND = 'Entity not found!',
  SOMETHING_WRONG = 'Something went wrong',
  PASSWORD_INCORRECT = 'Password incorrect! Please try again!',
  NOT_FOUND_USER_BY_EMAIL = 'User with this email does not exist',

  PASSWORD_NOT_EXIST = 'User password not exist!',

  REDIS_ERROR_GET_KEY = 'Have a error when get caching',
  REDIS_ERROR_SET_KEY = 'Have a error when set caching',

  NOT_OBJECT_OWNER = 'Can not process because you not the owner!',
}
