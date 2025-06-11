import React from 'react';

interface CustomerAvatarProps {
  name: string;
  className?: string;
}

const CustomerAvatar: React.FC<CustomerAvatarProps> = ({ name, className }) => (
  <div
    className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 ${className ?? ''}`}
  >
    {name?.charAt(0).toUpperCase()}
  </div>
);

export default CustomerAvatar;
