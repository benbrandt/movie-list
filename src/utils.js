// @flow
import slugify from "slugify";

export const slug = (
  title: string,
  releaseDate: string,
  type?: string = "movies"
) =>
  `/${type}/${slugify(`${title} ${releaseDate.substr(0, 4)}`, {
    remove: /[^\w\d\s]/g,
    lower: true
  })}`;
