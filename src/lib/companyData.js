import { companiesService } from "../services/companies.service";

export const COMPANIES_QUERY_KEY = ["companies"];
export const LOCAL_COMPANIES_QUERY_KEY = ["companies", "local"];

function createLocalId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

function getNames(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      return item?.name;
    })
    .filter(Boolean);
}

function unique(values) {
  const seen = new Set();

  return values.filter((value) => {
    const key =
      typeof value === "string" ? value.trim().toLowerCase() : String(value);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function normalizeCompany(company) {
  const technologyList = unique([
    ...getNames(company?.technologies),
    ...getNames(company?.technologyStack),
    ...getNames(company?.technology ? [company.technology] : []),
  ]);

  const roleList = unique([
    ...getNames(company?.jobRoleTags),
    ...getNames(company?.jobRoles),
    ...getNames(company?.role ? [company.role] : []),
  ]);

  return {
    ...company,
    industry: company?.industry || "Not specified",
    technology: technologyList.join(", ") || "Not specified",
    technologyList,
    role: roleList.join(", ") || "Not specified",
    roleList,
  };
}

function normalizeCompaniesResponse(response) {
  if (Array.isArray(response)) {
    return response.map(normalizeCompany);
  }

  if (Array.isArray(response?.companies)) {
    return response.companies.map(normalizeCompany);
  }

  return [];
}

export function mergeCompanies(responses) {
  const companiesById = new Map();

  responses.flatMap(normalizeCompaniesResponse).forEach((company) => {
    companiesById.set(company.id, company);
  });

  return [...companiesById.values()];
}

export async function fetchCompanies() {
  const firstPage = await companiesService.getAll();
  const totalPages = Number(firstPage?.totalPages) || 1;
  const paginatedResponses = [firstPage];

  if (!Array.isArray(firstPage) && totalPages > 1) {
    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        companiesService.getAll({ page: index + 2 }),
      ),
    );

    paginatedResponses.push(...remainingPages);
  }

  return mergeCompanies(paginatedResponses);
}

export function buildLocalCompany(createdCompany, submittedCompany) {
  const isApproved =
    createdCompany?.status === "approved" ||
    Boolean(createdCompany?.approvedAt || createdCompany?.approved_at);

  return normalizeCompany({
    ...submittedCompany,
    ...(createdCompany || {}),
    id: createdCompany?.id ?? createLocalId("company"),
    isLocalPending: !isApproved,
    status:
      createdCompany?.status ?? (isApproved ? "approved" : "pending"),
  });
}

export function isPendingCompany(company) {
  return Boolean(company?.isLocalPending || company?.status === "pending");
}
