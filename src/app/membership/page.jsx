"use client";
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function Membership() {
  const [selectedPlan, setSelectedPlan] = useState("individual");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    profession: "",
    company: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Algerie",
    membershipType: "individual",
    professionalStatus: "",
    domainOfInterest: ["skincare", "research"],
    biography: "",
    plan: "individual",
    acceptTerms: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [sslVerified, setSslVerified] = useState(false);

  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (window.location.protocol === "https:") {
      setSslVerified(true);
    }
  }, []);

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    setFormData((prevState) => ({
      ...prevState,
      plan: plan,
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const membershipPlans = [
    {
      id: "student",
      title: "Étudiant",
      price: "2500",
      period: "an",
      description: "Pour les étudiants en pharmacie",
      features: [
        "Accès aux événements à tarif réduit",
        "Newsletter mensuelle",
        "Accès aux ressources en ligne",
        "Certificat de membre étudiant",
      ],
      recommended: false,
    },
    {
      id: "individual",
      title: "Individuel",
      price: "8000",
      period: "an",
      description: "Pour les pharmaciens indépendants",
      features: [
        "Accès à tous les événements",
        "Formations à tarif préférentiel",
        "Accès à l'annuaire des membres",
        "Revue trimestrielle",
        "Certificat de membre",
      ],
      recommended: true,
    },
    {
      id: "corporate",
      title: "Entreprise",
      price: "35000",
      period: "an",
      description: "Pour les pharmacies et institutions",
      features: [
        "5 membres inclus",
        "Accès VIP aux événements",
        "Espace exposant privilégié",
        "Logo sur notre site web",
        "Newsletter personnalisée",
        "Support prioritaire",
      ],
      recommended: false,
    },
  ];

  const benefits = [
    {
      icon: "🎓",
      title: "Formations continues",
      description:
        "Accédez à des formations de qualité pour développer vos compétences",
    },
    {
      icon: "🤝",
      title: "Réseau professionnel",
      description:
        "Échangez avec des experts du secteur et développez votre réseau",
    },
    {
      icon: "📅",
      title: "Événements exclusifs",
      description:
        "Participez à nos congrès, séminaires et rencontres professionnelles",
    },
    {
      icon: "📚",
      title: "Ressources documentaires",
      description:
        "Accédez à notre bibliothèque de ressources et publications exclusives",
    },
    {
      icon: "🔍",
      title: "Veille réglementaire",
      description:
        "Restez informé des dernières évolutions réglementaires du secteur",
    },
    {
      icon: "🏆",
      title: "Reconnaissance professionnelle",
      description: "Bénéficiez d'une certification reconnue dans le secteur",
    },
  ];

  const getPlanAmount = () => {
    const plan = membershipPlans.find((p) => p.id === selectedPlan);
    return plan ? parseInt(plan.price) : 8000;
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    if (!formData.profession.trim()) {
      newErrors.profession = "La profession est requise";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Le code postal est requis";
    }
    if (!formData.city.trim()) {
      newErrors.city = "La ville est requise";
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions générales";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handlePayment = async () => {
    if (!recaptchaToken) {
      alert("Veuillez compléter le CAPTCHA pour continuer");
      recaptchaRef.current?.reset();
      return;
    }

    if (!sslVerified) {
      alert(
        "Veuillez utiliser une connexion sécurisée (HTTPS) pour procéder au paiement",
      );
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Register user
      const registerData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        profession: formData.profession,
        company: formData.company,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        membershipType: formData.membershipType,
        plan: selectedPlan,
        recaptchaToken: recaptchaToken,
        professionalStatus: formData.profession,
        domainOfInterest: ["skincare", "research"],
        biography: "",
        paymentMethod: selectedPaymentMethod,
        amount: getPlanAmount(),
      };

      console.log(registerData);

      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const registerResult = await registerResponse.json();
      console.log(registerResult);

      if (!registerResult.success) {
        throw new Error(registerResult.message || "Erreur d'enregistrement");
      }

      // Handle different payment methods
      if (selectedPaymentMethod === "cash") {
        // For cash payment, show success message immediately
        setIsSubmitted(true);
        setIsProcessing(false);
      } else {
        // For online payment, redirect to payment gateway with dynamic amount
        try {
          const amount = getPlanAmount();
          console.log(amount);
          const res = await axios.get(`/api/pay?am-ount=${amount}`);
          console.log("SATIM RESPONSE:", res.data);
          
          if (res.data.formUrl) {
            window.location.href = res.data.formUrl;
          } else if (res.data.error) {
            throw new Error(res.data.error);
          }
        } catch (err) {
          console.error("Payment API error:", err);
          alert(`Erreur lors de la redirection vers le paiement en ligne: ${err.message}`);
          setIsProcessing(false);
          recaptchaRef.current?.reset();
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Erreur: ${error.message}`);
      setIsProcessing(false);
      recaptchaRef.current?.reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      alert("Veuillez sélectionner un mode de paiement");
      return;
    }

    await handlePayment();
  };

  return (
    <div>
      <Head>
        <title>Adhésion - Fédération Algérienne des Pharmaciens</title>
        <meta
          name="description"
          content="Rejoignez la Fédération Algérienne des Pharmaciens et bénéficiez d'avantages exclusifs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          {/* SSL Security Badge */}
          <div className="text-center mb-6">
            {sslVerified ? (
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Connexion sécurisée
              </div>
            ) : (
              <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-semibold">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Veuillez utiliser HTTPS pour une connexion sécurisée
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">
            Devenez membre
          </h1>
          <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-12">
            Rejoignez notre communauté de professionnels de la pharmacie et
            bénéficiez d'avantages exclusifs, de ressources spécialisées et d'un
            réseau de qualité pour accompagner votre développement
          </p>

          {!isSubmitted ? (
            <>
              {/* Progress Steps */}
              <div className="max-w-3xl mx-auto mb-12">
                <div className="flex justify-between items-center">
                  <div
                    className={`flex flex-col items-center ${
                      currentStep >= 1 ? "text-blue-800" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        currentStep >= 1
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      1
                    </div>
                    <span className="mt-2 text-sm font-medium">
                      Informations personnelles
                    </span>
                  </div>
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      currentStep >= 2 ? "bg-blue-800" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`flex flex-col items-center ${
                      currentStep >= 2 ? "text-blue-800" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        currentStep >= 2
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      2
                    </div>
                    <span className="mt-2 text-sm font-medium">
                      Adresse et conditions
                    </span>
                  </div>
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      currentStep >= 3 ? "bg-blue-800" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`flex flex-col items-center ${
                      currentStep >= 3 ? "text-blue-800" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        currentStep >= 3
                          ? "bg-blue-800 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      3
                    </div>
                    <span className="mt-2 text-sm font-medium">Paiement</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-semibold text-center text-blue-800 mb-8">
                    Vos informations personnelles
                  </h2>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Prénom *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.firstName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.lastName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Adresse email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Mot de passe *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.password
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.password}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Minimum 6 caractères
                        </p>
                      </div>
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirmer le mot de passe *
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="profession"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Profession *
                        </label>
                        <input
                          type="text"
                          id="profession"
                          name="profession"
                          value={formData.profession}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.profession
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                        />
                        {errors.profession && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.profession}
                          </p>
                        )}
                      </div>
                    </div>
                   {/* <div className="mb-6">
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Entreprise / Organisation
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>*/}
                    <div className="text-center">
                      <button
                        onClick={nextStep}
                        className="px-8 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-lg"
                      >
                        Continuer
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 2: Address and Terms */}
              {currentStep === 2 && (
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-semibold text-center text-blue-800 mb-8">
                    Votre adresse et conditions
                  </h2>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-6">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Adresse *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label
                          htmlFor="postalCode"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Code postal *
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.postalCode
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                        />
                        {errors.postalCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.postalCode}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Ville *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                          required
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Pays *
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="Algerie">Algérie</option>
                          <option value="France">France</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Suisse">Suisse</option>
                          <option value="Canada">Canada</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    {/* Membership Plan Selection */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4">
                        Choisissez votre formule d'adhésion
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {membershipPlans.map((plan) => (
                          <div
                            key={plan.id}
                            className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
                              selectedPlan === plan.id
                                ? "border-blue-800 bg-blue-50"
                                : "border-gray-200"
                            } ${
                              plan.recommended ? "ring-2 ring-yellow-500" : ""
                            }`}
                            onClick={() => handlePlanChange(plan.id)}
                          >
                            {plan.recommended && (
                              <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                                Recommandé
                              </div>
                            )}
                            <h4 className="font-semibold text-blue-800">
                              {plan.title}
                            </h4>
                            <div className="text-lg font-bold text-blue-800 mt-2">
                              {plan.price} DA
                              <span className="text-sm font-normal text-gray-600">
                                {" "}
                                /{plan.period}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {plan.description}
                            </p>
                            <ul className="mt-3 text-sm text-gray-700 space-y-1">
                              {plan.features.slice(0, 2).map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                  <svg
                                    className="w-3 h-3 text-green-500 mt-1 mr-2 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="flex flex-col gap-2 my-6">
                      <div
                        className={`border p-3 cursor-pointer rounded-md transition-all ${
                          selectedPaymentMethod === "cash"
                            ? "border-blue-800 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => handlePaymentMethodChange("cash")}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                              selectedPaymentMethod === "cash"
                                ? "border-blue-800 bg-blue-800"
                                : "border-gray-400"
                            }`}
                          >
                            {selectedPaymentMethod === "cash" && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className="font-medium">Paiement par cash</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 ml-8">
                          Payez en espèces lors de votre visite à notre siège
                        </p>
                      </div>

                      <div
                        className={`border p-3 cursor-pointer rounded-md transition-all ${
                          selectedPaymentMethod === "online"
                            ? "border-blue-800 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => handlePaymentMethodChange("online")}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                              selectedPaymentMethod === "online"
                                ? "border-blue-800 bg-blue-800"
                                : "border-gray-400"
                            }`}
                          >
                            {selectedPaymentMethod === "online" && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className="font-medium">
                            Paiement en ligne par CIB/DHAHABIA
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 ml-8">
                          Paiement sécurisé via la plateforme SATIM
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div
                        className={`p-4 border rounded-md ${
                          errors.acceptTerms
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="acceptTerms"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                            required
                          />
                          <label
                            htmlFor="acceptTerms"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            J'accepte les{" "}
                            <a
                              href="/conditions-generales"
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              conditions générales
                            </a>{" "}
                            et la{" "}
                            <a
                              href="/politique-confidentialite"
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              politique de confidentialité
                            </a>{" "}
                            *
                          </label>
                        </div>
                        {errors.acceptTerms && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.acceptTerms}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Retour
                      </button>
                      <button
                        onClick={nextStep}
                        className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                      >
                        Continuer vers le paiement
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-semibold text-center text-blue-800 mb-8">
                    Finaliser votre adhésion
                  </h2>

                  {/* Order Summary */}
                  <div className="bg-blue-50 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      Récapitulatif de votre commande
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b">
                        <div>
                          <span className="font-medium">Formule </span>
                          <span className="text-blue-800 font-semibold">
                            {
                              membershipPlans.find((p) => p.id === selectedPlan)
                                ?.title
                            }
                          </span>
                        </div>
                        <span className="font-semibold">
                          {getPlanAmount().toLocaleString()} DA
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b">
                        <span>Mode de paiement</span>
                        <span className="font-medium">
                          {selectedPaymentMethod === "cash"
                            ? "Paiement par cash"
                            : "Paiement en ligne"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b">
                        <span>Frais d'adhésion</span>
                        <span>0 DA</span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b">
                        <span>TVA (0%)</span>
                        <span>0 DA</span>
                      </div>

                      <div className="pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">
                            Montant total à payer
                          </span>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-blue-800">
                              {getPlanAmount().toLocaleString()} DA
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {selectedPaymentMethod === "cash"
                                ? "À régler en espèces à notre siège"
                                : "Adhésion valable pour 1 an à partir de la date de paiement"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      {selectedPaymentMethod === "cash"
                        ? "Instructions pour le paiement en espèces"
                        : "Conditions générales de paiement et de vente"}
                    </h3>
                    <div className="text-sm text-gray-700 space-y-3 max-h-80 overflow-y-auto pr-2">
                      {selectedPaymentMethod === "cash" ? (
                        <>
                          <p>
                            <strong>
                              Instructions pour le paiement en espèces :
                            </strong>
                          </p>
                          <p>
                            Vous avez choisi de payer en espèces. Voici les
                            étapes à suivre :
                          </p>
                          <ol className="list-decimal list-inside space-y-2 pl-2">
                            <li>
                              Votre demande d'adhésion a été enregistrée avec
                              succès
                            </li>
                            <li>
                              Vous recevrez un email de confirmation avec votre
                              numéro de dossier
                            </li>
                            <li>
                              Présentez-vous à notre siège avec :
                              <ul className="list-disc list-inside ml-4 mt-1">
                                <li>Votre pièce d'identité</li>
                                <li>
                                  Votre diplôme de pharmacien (ou carte
                                  d'étudiant)
                                </li>
                                <li>
                                  Le montant de{" "}
                                  {getPlanAmount().toLocaleString()} DA en
                                  espèces
                                </li>
                              </ul>
                            </li>
                            <li>
                              Vous recevrez immédiatement votre carte de membre
                              après paiement
                            </li>
                          </ol>
                          <p>
                            <strong>Adresse de notre siège :</strong>
                            <br />
                            Fédération Algérienne des Pharmaciens
                            <br />
                            [Adresse complète à compléter]
                            <br />
                            Horaires d'ouverture : [Horaires à compléter]
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            <strong>Article 1 - Objet</strong>
                            <br />
                            Les présentes conditions générales régissent les
                            modalités d'adhésion à la Fédération Algérienne des
                            Pharmaciens et le processus de paiement en ligne.
                          </p>
                          <p>
                            <strong>
                              Article 2 - Prix et modalités de paiement
                            </strong>
                            <br />
                            Les prix sont indiqués en Dinars Algériens (DA)
                            toutes taxes comprises. Le paiement s'effectue
                            exclusivement en ligne via la plateforme sécurisée
                            SATIM.
                          </p>
                          <p>
                            <strong>
                              Article 3 - Sécurité des transactions
                            </strong>
                            <br />
                            Toutes les transactions sont sécurisées par le
                            protocole SSL 256-bit et certifiées PCI-DSS. Aucune
                            information bancaire n'est stockée sur nos serveurs.
                          </p>
                          <p>
                            <strong>Article 4 - Droit de rétractation</strong>
                            <br />
                            Conformément à la législation en vigueur, vous
                            disposez d'un délai de 7 jours ouvrables pour
                            exercer votre droit de rétractation.
                          </p>
                          <p>
                            <strong>Article 5 - Traitement des données</strong>
                            <br />
                            Vos données personnelles sont traitées conformément
                            à notre politique de confidentialité et ne sont en
                            aucun cas transmises à des tiers.
                          </p>
                          <p>
                            <strong>Article 6 - Service client</strong>
                            <br />
                            Pour toute question relative à votre paiement,
                            contactez le service client SATIM au numéro vert :{" "}
                            <strong className="text-green-600">3020</strong>.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ReCAPTCHA */}
                  <div className="mb-8">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">
                        Vérification de sécurité requise
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={
                          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
                          "6LcVVlQsAAAAAAzjUdbl4n2fYmCTUsfPLKeppt_U"
                        }
                        onChange={handleRecaptchaChange}
                      />
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="mb-8 text-center">
                    {selectedPaymentMethod === "online" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center mb-3">
                          <img
                            src="/satim_logo.jpg"
                            alt="SATIM Payment Gateway"
                            className="h-10 mr-3"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              Paiement sécurisé via SATIM
                            </p>
                            <p className="text-sm text-gray-600">
                              CIB / EDAHABIA / Cartes internationales
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          En cliquant sur le bouton ci-dessous, vous serez
                          redirigé vers la plateforme sécurisée de SATIM pour
                          finaliser votre paiement.
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={
                        isProcessing || !formData.acceptTerms || !recaptchaToken
                      }
                      className={`relative inline-flex items-center justify-center px-10 py-4 rounded-lg hover:opacity-90 transition-all font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[300px] ${
                        selectedPaymentMethod === "cash"
                          ? "bg-green-600 text-white"
                          : "bg-gradient-to-r from-blue-800 to-blue-600 text-white"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          Traitement en cours...
                        </>
                      ) : selectedPaymentMethod === "cash" ? (
                        <>
                          <svg
                            className="w-6 h-6 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>Finaliser l'adhésion (paiement par cash)</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-6 h-6 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          <span>Procéder au paiement sécurisé</span>
                          <img
                            src="/cib_logo.png"
                            alt="CIB"
                            className="h-8 ml-4"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        </>
                      )}
                    </button>

                    {selectedPaymentMethod === "online" && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-green-600 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium text-green-800 mr-2">
                            Service client SATIM :
                          </span>
                          <a
                            href="tel:3020"
                            className="text-green-700 font-bold text-xl hover:text-green-800"
                          >
                            30 20
                          </a>
                        </div>
                        <p className="text-sm text-green-700 text-center mt-2">
                          Disponible 24h/24, 7j/7 pour toute assistance
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t">
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                      disabled={isProcessing}
                    >
                      Retour
                    </button>

                    <div className="text-xs text-gray-500 text-right">
                      <p className="flex items-center">
                        <svg
                          className="w-4 h-4 text-green-500 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Connexion sécurisée SSL 256-bit
                      </p>
                      <p>Certifié PCI-DSS • Données cryptées</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-green-500 text-6xl mb-6">✅</div>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Félicitations !
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Votre adhésion à la Fédération Algérienne des Pharmaciens a été
                enregistrée avec succès.
              </p>

              {selectedPaymentMethod === "cash" ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg mb-8">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Paiement par cash - Instructions :
                    </h3>
                    <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
                      <li>
                        Présentez-vous à notre siège avec :
                        <ul className="list-circle list-inside ml-4 mt-1">
                          <li>Votre pièce d'identité</li>
                          <li>
                            Votre diplôme de pharmacien (ou carte d'étudiant)
                          </li>
                          <li>
                            Le montant de {getPlanAmount().toLocaleString()} DA
                            en espèces
                          </li>
                        </ul>
                      </li>
                      <li>
                        Adresse : Fédération Algérienne des Pharmaciens -
                        [Adresse à compléter]
                      </li>
                      <li>Horaires : [Horaires à compléter]</li>
                      <li>
                        Vous recevrez immédiatement votre carte de membre après
                        paiement
                      </li>
                    </ul>
                  </div>
                  <p className="text-gray-600 mb-8">
                    Un email de confirmation contenant tous les détails de votre
                    adhésion et notre adresse exacte a été envoyé à{" "}
                    <span className="font-medium">{formData.email}</span>.
                  </p>
                </>
              ) : (
                <p className="text-gray-600 mb-8">
                  Un email de confirmation contenant tous les détails de votre
                  adhésion a été envoyé à{" "}
                  <span className="font-medium">{formData.email}</span>.
                </p>
              )}

              <div className="bg-blue-50 p-4 rounded-lg mb-8">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Prochaines étapes :
                </h3>
                <ul className="text-left list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Vous recevrez votre carte de membre sous 10 jours ouvrables
                  </li>
                  <li>Accédez à votre espace membre avec vos identifiants</li>
                  <li>
                    Consultez notre calendrier d'événements pour votre première
                    participation
                  </li>
                </ul>
              </div>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Retour à l'accueil
              </button>
            </div>
          )}

          {/* Benefits Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
              Avantages exclusifs pour nos membres
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
              Questions fréquentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Quand vais-je recevoir ma carte de membre ?
                </h3>
                <p className="text-gray-700">
                  Votre carte de membre sera envoyée dans les 10 jours ouvrables
                  suivant la validation de votre paiement. Vous recevrez un
                  email de confirmation avec un suivi de livraison.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Puis-je modifier ma formule d'adhésion plus tard ?
                </h3>
                <p className="text-gray-700">
                  Oui, vous pouvez changer de formule à tout moment. La
                  différence de tarif sera calculée au prorata du temps restant
                  sur votre adhésion actuelle.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Comment accéder à mon espace membre ?
                </h3>
                <p className="text-gray-700">
                  Dès que votre paiement est confirmé, vous recevez un email
                  avec vos identifiants pour accéder à votre espace membre sur
                  notre site.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  L'adhésion est-elle déductible fiscalement ?
                </h3>
                <p className="text-gray-700">
                  Pour les pharmaciens, les frais d'adhésion sont généralement
                  déductibles en tant que frais professionnels. Nous vous
                  fournissons une facture pour justifier de cette dépense.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}