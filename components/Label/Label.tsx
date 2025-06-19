import { Text } from "../Text";

interface LabelProps {
  children: React.ReactNode;
}

const Label = ({ children }: LabelProps) => {
  return (
    <Text
      style={{
        marginBottom: 6,
      }}>
      {children}
    </Text>
  );
};

export default Label;
