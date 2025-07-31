interface AuthHeaderProps {
  logoClass?: string;
  heading: string;
  subheading: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ logoClass, heading, subheading }) => {
  return (
    <div className="flex flex-col gap-2 items-center text-[#333333] px-4 sm:px-8 md:px-0">
      <div className={`w-10 h-10 rounded-full ${logoClass}`} />
      <h2 className="text-2xl font-[500] text-center">{heading}</h2>
      <p className="text-center text-sm">{subheading}</p>
    </div>
  );
};

export default AuthHeader;
