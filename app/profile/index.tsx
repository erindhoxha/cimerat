import { Box } from "@/components/Box";
import { useAuth } from "@/components/context/AuthContext";
import { Text } from "@/components/Text";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet } from "react-native";

export default function ProfileScreen() {
  const { token } = useAuth();

  const { data, error, status } = useQuery({
    queryKey: ["user"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      return res.json();
    },
  });

  if (status === "pending") {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Duke ngarkuar...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Error: {error.message}</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} padding={20} gap={12} style={styles.container}>
      <Text fontSize="xl" fontWeight="bold">
        Profili
      </Text>
      <Box>
        <Box gap={8}>
          <Text>Emri i përdoruesit:</Text>
          <Text fontWeight="bold" fontSize="md">
            {" "}
            {data.user.username}
          </Text>
        </Box>
        <Box marginTop={24}>
          <Text>Dërgoni një mesazh nëse keni nevojë për ndihmë ose keni pyetje.</Text>
        </Box>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
