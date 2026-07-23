import { createAddress, countUserAddresses,setDefaultAddress, clearDefaultAddress, findAddressesByUserId, findAddressByIdAndUser , updateAddress, findFirstUserAddress, deleteAddress} from "../repositories/address.repository.js";

export async function createAddressService(userId, data) {
    // Make a copy so we don't mutate req.validatedData
    const addressData = { ...data };

    // Count existing addresses
    const totalAddresses = await countUserAddresses(userId);

    // First address should always be default
    if (totalAddresses === 0) {
        addressData.isDefault = true;
    }

    // If user explicitly wants this as default,
    // remove default from all other addresses
    if (addressData.isDefault) {
        await clearDefaultAddress(userId);
    }

    // Create address
    return createAddress({
        ...addressData,
        userId,
    });
}

export async function getAddressesbyUserId(userId) {
    return findAddressByUserId(userId);
}

export async function getAddressService(userId, addressId) {
    const address = await findAddressByIdAndUser(userId, addressId);
    if (!address) {
        throw new NotFoundError("Address not found")
        
    }
    return address;
}

export async function updateAddressService(
  userId,
  addressId,
  data
) {
  // Verify ownership
  const address = await findAddressByIdAndUser(
    addressId,
    userId
  );

  if (!address) {
    throw new Error("Address not found.");
  }


  const addressData = { ...data };

//default address
  if (addressData.isDefault === true) {
    await clearDefaultAddress(userId);
  }

  // Update address
  return updateAddress(addressId, addressData);
}

export async function setDefaultAddressService(
  userId,
  addressId
) {
  // Verify ownership
  const address = await findAddressByIdAndUser(
    addressId,
    userId
  );

  if (!address) {
    throw new Error("Address not found.");
  }

  // Already default
  if (address.isDefault) {
    return address;
  }

  // Remove previous default
  await clearDefaultAddress(userId);

  // Set new default
  return setDefaultAddress(addressId);
}

export async function deleteAddressService(
  userId,
  addressId
) {
  // Verify ownership
  const address = await findAddressByIdAndUser(
    addressId,
    userId
  );

  if (!address) {
    throw new Error("Address not found.");
  }

  const wasDefault = address.isDefault;

  // Delete address
  await deleteAddress(addressId);

  
  // assign another default address
  if (wasDefault) {
    const nextAddress =
      await findFirstUserAddress(userId);

    if (nextAddress) {
      await setDefaultAddress(nextAddress.id);
    }
  }

  return {
    message: "Address deleted successfully.",
  };
}