
const Skeleton = ({ className, ...others }) => {
  return (
    <div className={`${className}`} {...others}></div>
  );
};

export default Skeleton;