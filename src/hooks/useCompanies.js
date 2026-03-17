import { useState, useEffect } from "react";
import { companiesService } from "../services/companies.service";

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

function normalizeCompany(company) {
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

function mergeCompanies(responses) {
  const companiesById = new Map();

  responses.flatMap(normalizeCompaniesResponse).forEach((company) => {
    companiesById.set(company.id, company);
  });

  return [...companiesById.values()];
}

export function useCompanies() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

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

        if (isActive) {
          setData(mergeCompanies(paginatedResponses));
        }
      } catch (err) {
        console.error("API error:", err);

        if (isActive) {
          setError(err);
          setData([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  return { data, isLoading, error };
}
