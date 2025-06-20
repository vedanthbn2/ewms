"use client";

interface User {
  email: string;
  token: string;
  role: string;
  id: string;
  fullname: string;
  phoneNumber: string;
  username: string;
}

export const setUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const setUserID = (id: string) => {
  localStorage.setItem("userId", id);
};

export const setUserName = (name: string) => {
  localStorage.setItem("userName", name);
};

export const setfullname = (fullname: string) => {
  localStorage.setItem("fullname", fullname);
};

export const setEmail = (email: string) => {
  localStorage.setItem("email", email);
};

export const setPhoneNumber = (phone: string) => {
  localStorage.setItem("phoneNumber", phone);
};

export const getEmail = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("email") || "";
  }
  return "";
};

export const getPhoneNumber = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("phoneNumber") || "";
  }
  return "";
};

export const getUserID = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("userId") || "";
  }
  return "";
};

export const getfullname = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("fullname") || "";
  }
  return "";
};

export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem("token");
  }
  return false;
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const getUserName = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("userName") || "";
  }
  return "";
};

export const getToken = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token") || "";
  }
  return "";
};

export const handleLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("fullname");
    localStorage.removeItem("email");
    localStorage.removeItem("phoneNumber");
    window.location.href = "/sign-in";
  }
};
