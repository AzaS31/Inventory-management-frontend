export const getAccessInfo = ({ user, ownerId, isPublic = false, accesses = [] }) => {
    const isAdmin = user?.role?.name === "ADMIN";
    const isOwner = user?.id === ownerId;
    const canEdit = isAdmin || isOwner || (isPublic && user) || (!isPublic && accesses?.some(a => a.user.id === user?.id));
    return { isAdmin, isOwner, canEdit };
};
