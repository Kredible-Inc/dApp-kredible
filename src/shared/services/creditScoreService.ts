import Contract from "@/lib/credit_score/credit_score";

export const getCreditScore = async (user: string) => {
  try {
    const transaction = await Contract.get_score({ user });
    console.log("Transaction:", transaction);
    const simulation = await transaction.simulate();

    if (simulation.result) {
      return simulation.result as number;
    } else {
      throw new Error("Failed to get credit score from contract");
    }
  } catch (error) {
    console.error("Error getting credit score:", error);
    throw error;
  }
};

export const setCreditScore = async (user: string, score: number) => {
  try {
    const transaction = await Contract.set_score({ user, score });
    const simulation = await transaction.simulate();

    if (simulation.result) {
      const result = await transaction.signAndSend();
      return result;
    } else {
      throw new Error("Failed to set credit score in contract");
    }
  } catch (error) {
    console.error("Error setting credit score:", error);
    throw error;
  }
};
