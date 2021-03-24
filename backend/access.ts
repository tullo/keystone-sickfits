import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

// At it's simplest, the access control returns a yes or no value
// depending on the users session.
export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

// ============================================================================
// PERMISSION ACCESS FUNCTIONS
// ============================================================================

const generatedPermissions = Object.fromEntries(
  // for each permission return an array...
  permissionsList.map((permission) => [
    // where the key is the permission...
    permission,
    // the value is a function that takes in a session
    // and return ListAccessArgs
    function ({ session }: ListAccessArgs) {
      // add all entries matching permission keys in the permissionsList.
      // !! => coerces a truthy value into a real true boolean.
      // question: (got the current user assigned that permission in the role) ??
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a criteria - yes or no.
export const permissions = {
  // spread over the permission keys and add them here:
  ...generatedPermissions,

  // EXAMPLE on how to add another permission function ...
  // function that takes  in a session and returns ListAccessArgs
  isAwesome({ session }: ListAccessArgs): boolean {
    return session?.data.name.includes('wes');
  },
};

// ============================================================================
// RULE BASED FUNCTIONS
// ============================================================================

// Rules can return a boolean - yes or no, or
// a filter which limits which products they can CRUD.

export const rules = {
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    // Do they have the permission of canManageProducts?
    if (permissions.canManageCart({ session })) {
      return true;
    }

    // If not, do they own this item?
    return { order: { user: { id: session.itemId } } };
  },

  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    // Do they have the permission of canManageProducts?
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // If not, do they own this item?
    return { user: { id: session.itemId } };
  },

  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    if (permissions.canManageUsers({ session })) {
      return true;
    }

    // Otherwise they may only update themselves!
    return { id: session.itemId };
  },

  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    // Do they have the permission of canReadProducts?
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // They should only see available products
    // (based on the status field)
    return { status: 'AVAILABLE' };
  },

  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    // Do they have the permission of canManageProducts?
    if (permissions.canManageCart({ session })) {
      return true;
    }

    // If not, do they own this item?
    return { user: { id: session.itemId } };
  },
};
