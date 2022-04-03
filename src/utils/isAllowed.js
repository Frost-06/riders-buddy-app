import { CompareRounded } from "@material-ui/icons";

export function isAllowed(userContext, roles) {
  if (!roles || !userContext) return false;
  if (typeof roles !== "object") return false;
  return roles.indexOf(userContext?.user_type?.name) >= 0;
}
export function isEither(context, compare) {
  return compare.indexOf(context) >= 0;
}
