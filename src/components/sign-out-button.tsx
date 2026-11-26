import { useTheme } from "@/theme";
import { Pressable, Text } from "react-native";
import { supabase } from "../../lib/supabase";

export function SignOutButton() {
  const t = useTheme();
  return (
    <Pressable
      onPress={() => supabase.auth.signOut()}
      style={{
        backgroundColor: t.buttonBg,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        margin: 16,
      }}
    >
      <Text style={{ color: t.buttonText, fontWeight: "600" }}>Sair</Text>
    </Pressable>
  );
}
