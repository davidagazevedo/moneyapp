import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) =>
      setSession(s),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  function show(text: string, error: boolean) {
    setMessage(text);
    setIsError(error);
  }

  async function signUp() {
    setLoading(true);
    show("", false);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) show(error.message, true);
    else show("Conta criada!", false);
    setLoading(false);
  }

  async function signIn() {
    setLoading(true);
    show("", false);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) show(error.message, true);
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>MoneyApp</Text>

          {session ? (
            <>
              <Text style={styles.subtitle}>Você está logado</Text>
              <Text style={styles.email}>{session.user.email}</Text>
              <Pressable style={styles.button} onPress={signOut}>
                <Text style={styles.buttonText}>Sair</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.subtitle}>
                Controle suas finanças em um só lugar
              </Text>

              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha (mínimo 6 caracteres)"
                placeholderTextColor="#999"
                secureTextEntry
                autoComplete="password"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={signIn}
              />

              <Pressable
                style={[styles.button, loading && styles.disabled]}
                onPress={signIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </Pressable>

              <Pressable
                style={[styles.buttonOutline, loading && styles.disabled]}
                onPress={signUp}
                disabled={loading}
              >
                <Text style={styles.outlineText}>Criar conta</Text>
              </Pressable>

              {message ? (
                <Text style={isError ? styles.error : styles.success}>
                  {message}
                </Text>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f4f6f8" },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#555",
    marginBottom: 8,
  },
  email: { textAlign: "center", color: "#111", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111",
  },
  button: {
    backgroundColor: "#0a7ea4",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#0a7ea4",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  outlineText: { color: "#0a7ea4", fontWeight: "600", fontSize: 16 },
  disabled: { opacity: 0.6 },
  error: { color: "#b00020", textAlign: "center" },
  success: { color: "#1b7f3b", textAlign: "center" },
});
