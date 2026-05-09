export type CommerceProvider =
  | "mock"
  | "amazon-handoff"
  | "agentic-commerce-protocol"
  | "x402"
  | "browser-checkout";

export type ProductCandidate = {
  id: string;
  title: string;
  provider: CommerceProvider;
  priceLabel: string;
  learningReason: string;
  safetyNote: string;
  approvalRequired: true;
};

export type PurchaseApproval = {
  id: string;
  productId: string;
  provider: CommerceProvider;
  status: "draft" | "parent-approved" | "blocked";
  spendingCapLabel: string;
  auditNote: string;
};

export const toyCandidates: ProductCandidate[] = [
  {
    id: "soft-basketball-card-set",
    title: "Soft toddler basketball + movement cards",
    provider: "mock",
    priceLabel: "$18 mock",
    learningReason:
      "Matches sports heroes, hopping, fast/slow movement, and basketball interest.",
    safetyNote: "Ages 2+. Soft material. Parent supervision recommended.",
    approvalRequired: true,
  },
  {
    id: "recycling-truck-sorter",
    title: "Recycling truck sorting toy",
    provider: "amazon-handoff",
    priceLabel: "Parent checks live price",
    learningReason:
      "Connects garbage truck interest to cleanup, responsibility, and sorting.",
    safetyNote: "Agent must filter for age rating, choking hazards, and returns.",
    approvalRequired: true,
  },
];

export function createMockPurchaseApproval(
  product: ProductCandidate,
): PurchaseApproval {
  return {
    id: `approval-${product.id}`,
    productId: product.id,
    provider: product.provider,
    status: "parent-approved",
    spendingCapLabel: product.priceLabel,
    auditNote:
      "Demo receipt only. Production checkout must use scoped payment authorization, spend limits, and explicit parent confirmation.",
  };
}
