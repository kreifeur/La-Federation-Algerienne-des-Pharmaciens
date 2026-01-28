// app/login/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import logo from "../../../public/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    // Optional: Check if user is already logged in
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        const redirectPath = userData.role === "admin" ? "/admin" : "/";
        router.push(redirectPath);
      } catch (e) {
        console.error("Error parsing stored user data:", e);
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validation basique
      if (!email || !password) {
        throw new Error("Veuillez remplir tous les champs");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Veuillez entrer une adresse email valide");
      }

      // Appel à l'API de connexion
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      if (data.success && data.data.token) {
        // Connexion réussie
        console.log("Connexion réussie!", data.data.user);
        
        // Store auth token in localStorage
        localStorage.setItem("authToken", data.data.token);
        
        // Maintenant, récupérer les données complètes du profil
        try {
          const profileResponse = await fetch("/api/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.data.token}`,
            },
          });

          if (!profileResponse.ok) {
            throw new Error("Impossible de récupérer le profil");
          }

          const profileData = await profileResponse.json();
          
          if (profileData.success) {
            // Stocker les données complètes du profil
            const fullUserData = {
              ...data.data.user, // Données de base de l'API login
              ...profileData.data // Données détaillées de l'API profile
            };
            
            localStorage.setItem("user", JSON.stringify(fullUserData));
            console.log("Profil complet récupéré:", fullUserData);
            
            // Stocker également des données spécifiques pour un accès facile
            if (fullUserData.role) {
              localStorage.setItem("userRole", fullUserData.role);
            }
            
            if (fullUserData._id || fullUserData.userId) {
              localStorage.setItem("userId", fullUserData._id || fullUserData.userId);
            }
            
            if (fullUserData.firstName && fullUserData.lastName) {
              localStorage.setItem("userFullName", `${fullUserData.firstName} ${fullUserData.lastName}`);
            }
            
            if (fullUserData.membershipStatus) {
              localStorage.setItem("membershipStatus", fullUserData.membershipStatus);
            }
            
          } else {
            // Si l'API profile échoue, stocker seulement les données de login
            localStorage.setItem("user", JSON.stringify(data.data.user));
            console.warn("API profile non disponible, utilisation des données de base");
          }
        } catch (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError);
          // Stocker quand même les données de login
          localStorage.setItem("user", JSON.stringify(data.data.user));
        }

        // If remember me is checked, also store email for convenience
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Dispatch storage event to notify other tabs/components
        window.dispatchEvent(new Event("storage"));

        setSuccess(true);

        // Redirection avec le router Next.js
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const redirectPath = userData.role === "admin" ? "/admin" : "/";
        
        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);
      } else {
        throw new Error(data.message || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      setError(err.message);
      console.error("Erreur de connexion:", err);

      // Clear localStorage on failed login attempt
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("userFullName");
      localStorage.removeItem("membershipStatus");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connexion réussie !
          </h2>
          <p className="text-gray-600">
            Redirection vers votre tableau de bord...
          </p>
          <div className="mt-4">
            <div className="w-24 h-1 bg-blue-200 rounded-full mx-auto">
              <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Head>
        <title>Connexion - La Fédération Algérienne des Pharmaciens</title>
        <meta
          name="description"
          content="Connectez-vous à votre espace membre"
        />
      </Head>

      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
          <Link href="/">
            <img
              className="w-[200px] cursor-pointer"
              src={logo.src}
              alt="logo"
            />
          </Link>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous à votre espace membre
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-red-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Adresse email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="votre@email.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Votre mot de passe"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900 cursor-pointer"
                  >
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-800 hover:bg-blue-700"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Connexion...
                    </div>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Nouveau membre ?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/membership"
                  className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Adhérer à l'association
                </Link>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Comptes de démonstration
              </h3>

              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-blue-700 mb-1">
                    Membre
                  </h4>
                  <p className="text-xs text-blue-600">
                    Email:{" "}
                    <span className="font-mono">ibrahim@example.com</span>
                    <br />
                    Mot de passe: <span className="font-mono">passe123</span>
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-blue-700 mb-1">
                    Admin
                  </h4>
                  <p className="text-xs text-blue-600">
                    Email:{" "}
                    <span className="font-mono">brahimadmin@gmail.com</span>
                    <br />
                    Mot de passe: <span className="font-mono">passe123</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Besoin d'aide ?{" "}
              <Link
                href="/contact"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Contactez notre support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}