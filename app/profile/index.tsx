import { Box } from "@/components/Box";
import { Button } from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { Text } from "@/components/Text";

export default function ProfileScreen() {
  return (
    <Box flex={1} padding={24} gap={12}>
      <Text fontSize="xl" fontWeight="bold">
        Profili
      </Text>
      <Box>
        <Box>
          <Input label="Përditëso email adresën" placeholder="Email adresa" autoCapitalize="none" />
        </Box>
        <Box>
          <Input label="Përditëso fjalëkalimin" placeholder="Fjalëkalimi i ri" autoCapitalize="none" />
        </Box>
        <Button variant="primary">Perditëso të dhënat</Button>
      </Box>
    </Box>
  );
}
