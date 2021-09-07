import { signIn, useSession } from "next-auth/client";
import React from "react";

export interface SessionGateProps {}

const SessionGate: React.FC<SessionGateProps> = ({ children }) => {
  const [session, sessionLoading] = useSession();

  React.useEffect(() => {
    if (!sessionLoading && !session) {
      signIn("discord");
    }
  }, [sessionLoading, session]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default SessionGate;
