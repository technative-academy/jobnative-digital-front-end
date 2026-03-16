import { useEffect, useState } from "react";
import { companiesService } from "../../services/companies.service";
import { Button } from "@/components/ui/button";
import Tag from "../../components/Tag/Tag";
import { getRandomColor } from "../../utils.js";
import "./Admin.css";

function Admin() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  async function loadPending() {
    try {
      setIsLoading(true);
      const data = await companiesService.getPending();
      setCompanies(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function handleApprove(id) {
    try {
      await companiesService.approve(id);
      setActionMessage("Company approved.");
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setActionMessage("Failed to approve company.");
    }
  }

  async function handleReject(id) {
    try {
      await companiesService.reject(id);
      setActionMessage("Company rejected.");
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setActionMessage("Failed to reject company.");
    }
  }

  if (isLoading) return <p>Loading pending companies...</p>;
  if (error) return <p>Something went wrong loading pending companies.</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin - Pending Companies</h1>

      {actionMessage && (
        <p className="admin-message">{actionMessage}</p>
      )}

      {companies.length === 0 ? (
        <p>No pending companies to review.</p>
      ) : (
        <div className="admin-list">
          {companies.map((company) => (
            <div key={company.id} className="admin-card">
              <div className="admin-card-header">
                <h2>{company.name}</h2>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="admin-link">
                    Website
                  </a>
                )}
              </div>
              {company.description && (
                <p className="admin-card-description">{company.description}</p>
              )}
              <div className="admin-card-tags">
                {company.technologies?.map((tech) => (
                  <Tag key={tech.name} text={tech.name} colour={getRandomColor()} />
                ))}
                {company.industry && <Tag text={company.industry} colour="lightpink" />}
              </div>
              <div className="admin-card-actions">
                <Button onClick={() => handleApprove(company.id)}>Approve</Button>
                <Button variant="destructive" onClick={() => handleReject(company.id)}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
