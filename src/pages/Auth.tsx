// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// // import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import { Building2 } from "lucide-react";

// const Auth = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [loading, setLoading] = useState(false);

//   // useEffect(() => {
//   //   supabase.auth.getSession().then(({ data: { session } }) => {
//   //     if (session) {
//   //       navigate("/");
//   //     }
//   //   });

//   //   const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//   //     if (session) {
//   //       navigate("/");
//   //     }
//   //   });

//   //   return () => subscription.unsubscribe();
//   // }, [navigate]);

//   // const handleAuth = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setLoading(true);

//   //   try {
//   //     if (isLogin) {
//   //       // const { error } = await supabase.auth.signInWithPassword({
//   //       //   email,
//   //       //   password,
//   //       // });

//   //       // if (error) throw error;
//   //       const response = await fetch('http://127.0.0.1:8000/api-auth/login/', {
//   //         method: 'POST',
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //         },
//   //         body: JSON.stringify({
//   //           username: email,
//   //           password: password,
//   //         }),
//   //       });
//   //       if (!response.ok) throw new Error("Failed to log in");
//   //       toast.success("Welcome back!");
//   //     } else {
//   //       const { error } = await supabase.auth.signUp({
//   //         email,
//   //         password,
//   //         options: {
//   //           emailRedirectTo: `${window.location.origin}/`,
//   //           data: {
//   //             full_name: fullName,
//   //           },
//   //         },
//   //       });

//   //       if (error) throw error;
//   //       toast.success("Account created successfully!");
//   //     }
//   //   } catch (error: any) {
//   //     toast.error(error.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleAuth = {

//   }
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary p-4">
//       <Card className="w-full max-w-md shadow-[var(--shadow-elegant)]">
//         <CardHeader className="text-center">
//           <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
//             <Building2 className="w-6 h-6 text-primary-foreground" />
//           </div>
//           <CardTitle className="text-2xl">Meeting Room Booking</CardTitle>
//           <CardDescription>
//             {isLogin ? "Sign in to book meeting rooms" : "Create an account to get started"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleAuth} className="space-y-4">
//             {!isLogin && (
//               <div className="space-y-2">
//                 <Label htmlFor="fullName">Full Name</Label>
//                 <Input
//                   id="fullName"
//                   type="text"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   required={!isLogin}
//                   placeholder="John Doe"
//                 />
//               </div>
//             )}
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="you@company.com"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 placeholder="••••••••"
//                 minLength={6}
//               />
//             </div>
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
//             </Button>
//           </form>
//           <div className="mt-4 text-center text-sm">
//             <button
//               type="button"
//               onClick={() => setIsLogin(!isLogin)}
//               className="text-primary hover:underline"
//             >
//               {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
//             </button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Auth;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleAuth = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     if (isLogin) {
  //       // 🔑 LOGIN with Django API
  //       const response = await fetch("http://127.0.0.1:8000/api/login/", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           username: email, // Django uses username, not email by default
  //           password: password,
  //         }),
  //       });

  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error(data.error || "Invalid credentials");
  //       }

  //       localStorage.setItem("token", data.token);
  //       toast.success("Login successful!");
  //       navigate("/");
  //     } else {
  //       // 🆕 REGISTER new user
  //       const response = await fetch("http://127.0.0.1:8000/api/register/", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           username: email,
  //           email,
  //           password,
  //         }),
  //       });

  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error(data.error || "Failed to register");
  //       }

  //       toast.success("Account created successfully! Please login.");
  //       setIsLogin(true);
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAuth = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const url = isLogin
      ? "http://127.0.0.1:8000/api/login/"
      : "http://127.0.0.1:8000/api/register/";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email, // Django uses username, not email
        email,
        password, 
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Authentication failed");

    localStorage.setItem("token", data.token);
    toast.success(isLogin ? "Welcome back!" : "Account created!");
    navigate("/");
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};

// Example function to fetch rooms with token
  const fetchRooms = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must log in first!");
      return;
    }

  //   try {
  //     const res = await fetch("http://127.0.0.1:8000/api/rooms/", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Token ${token}`, // ✅ Send token here
  //       },
  //     });
  //     const rooms = await res.json();
  //     console.log("Rooms:", rooms);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to fetch rooms");
  //   }
  // };

   const response = await fetch("http://127.0.0.1:8000/api/rooms/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`, // ✅ Required for DRF token auth
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Failed to fetch rooms");
  }

  const data = await response.json();
  return data;
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-elegant)]">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Meeting Room Booking</CardTitle>
          <CardDescription>
            {isLogin ? "Sign in to book meeting rooms" : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  placeholder="John Doe"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

