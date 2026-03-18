import './Home.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownUp, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCompanies } from '../../hooks/useCompanies';
import { useDeleteCompany } from '../../hooks/useDeleteCompany';
import { isPendingCompany } from '../../lib/companyData';
import Filters from '../../components/Filters/Filters';
import CompanyCard from '../../components/CompanyCard/CompanyCard';
import CompanyCardSkeleton from '../../components/CompanyCard/CompanyCardSkeleton';
import AddCompanyDialog from '../../components/AddCompanyDialog/AddCompanyDialog';
import PageNav from '../../components/PageNav/PageNav';
import { useAuth } from '../../hooks/useAuth';
import { usePageSize } from '../../hooks/usePageSize';

const SORT_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'createdAt', label: 'Date', labelFull: 'Date added' },
  { key: 'updatedAt', label: 'Updated' },
];

const successToastStyle = {
  background: '#f5f3fb',
  border: '2px solid #7e57e1',
  color: '#3d0fa8',
};

const errorToastStyle = {
  background: '#fff5f5',
  border: '1px solid #fecaca',
  color: '#7f1d1d',
};

function getCompanySortValue(company, field) {
  if (field === 'createdAt') {
    return new Date(company.createdAt || 0).getTime();
  }
  if (field === 'updatedAt') {
    return new Date(company.updatedAt || company.createdAt || 0).getTime();
  }

  return (company[field] ?? '').toString().toLowerCase();
}

function Home() {
  const { data: companies, isLoading, error } = useCompanies();
  const { isAuthenticated, user } = useAuth();
  const { deleteCompany } = useDeleteCompany();
  const navigate = useNavigate();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [companyPendingDelete, setCompanyPendingDelete] = useState(null);
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);

  const [filters, setFilters] = useState({
    location: [],
    industry: [],
    technology: [],
    role: [],
  });
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = usePageSize();

  const sortedCompanies = useMemo(() => {
    const filteredCompanies =
      companies?.filter((company) => {
        return (
          (filters.location.length === 0 ||
            filters.location.includes(company.location)) &&
          (filters.industry.length === 0 ||
            filters.industry.includes(company.industry)) &&
          (filters.technology.length === 0 ||
            company.technologyList?.some((tech) =>
              filters.technology.includes(tech),
            )) &&
          (filters.role.length === 0 ||
            company.roleList?.some((role) => filters.role.includes(role)))
        );
      }) || [];

    return [...filteredCompanies].sort((a, b) => {
      const aVal = getCompanySortValue(a, sortField);
      const bVal = getCompanySortValue(b, sortField);
      if (aVal < bVal) return -1 * sortDir;
      if (aVal > bVal) return 1 * sortDir;
      // Tiebreaker: sort by id so reversing direction always flips the list
      if (a.id < b.id) return -1 * sortDir;
      if (a.id > b.id) return 1 * sortDir;
      return 0;
    });
  }, [companies, filters, sortField, sortDir]);

  // Reset to page 1 when filters, sort, or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortField, sortDir, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sortedCompanies.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedCompanies = sortedCompanies.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  if (error) return <p className="home-status">Something went wrong.</p>;

  async function handleDeleteCompany() {
    if (!companyPendingDelete) return;
    try {
      setIsDeletingCompany(true);
      await deleteCompany(companyPendingDelete.id);
      toast.success('Company deleted', {
        description: `${companyPendingDelete.name} has been removed.`,
        style: successToastStyle,
      });
      setCompanyPendingDelete(null);
    } catch (deleteError) {
      toast.error('Could not delete company', {
        description: deleteError?.message || 'Please try again.',
        style: errorToastStyle,
      });
    } finally {
      setIsDeletingCompany(false);
    }
  }

  return (
    <div className="home-page page-transition">
      <AddCompanyDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) setEditingCompany(null);
        }}
        company={editingCompany}
      />

      <AlertDialog
        open={Boolean(companyPendingDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeletingCompany) setCompanyPendingDelete(null);
        }}
      >
        <AlertDialogContent className="border-[#ddd5f0] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-[#fff3f2] text-[#dc2626]">
              <Trash2 className="size-7" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this company?</AlertDialogTitle>
            <AlertDialogDescription>
              {companyPendingDelete
                ? `${companyPendingDelete.name} will be removed from the companies list. This action cannot be undone.`
                : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingCompany}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingCompany}
              className="bg-[#dc2626] hover:bg-[#b91c1c] focus-visible:ring-[#fecaca]"
              onClick={async (event) => {
                event.preventDefault();
                await handleDeleteCompany();
              }}
            >
              {isDeletingCompany ? 'Deleting...' : 'Delete company'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="home-hero">
        <div
          className="home-hero__brand page-hero-copy"
          style={{ '--hero-copy-delay': '0.08s' }}
        >
          <span className="home-hero__brand--primary">Job</span>
          <span className="home-hero__brand--dark">Native</span>
        </div>
        <h1
          className="home-hero__title page-hero-copy"
          style={{ '--hero-copy-delay': '0.18s' }}
        >
          Companies worth knowing
        </h1>
        <p
          className="home-hero__subtitle page-hero-copy"
          style={{ '--hero-copy-delay': '0.28s' }}
        >
          Discover local companies, their tech stacks, and what people are
          saying
        </p>
        {companies?.length > 0 && (
          <span
            className="home-hero__badge page-hero-copy"
            style={{ '--hero-copy-delay': '0.52s' }}
          >
            {companies.length} companies listed
          </span>
        )}
      </div>

      <div className="home-toolbar">
        {isLoading ? (
          <div
            className="skeleton"
            style={{ height: 44, width: 340, borderRadius: 12 }}
          />
        ) : (
          <Filters
            filters={filters}
            setFilters={setFilters}
            bare
            variant="purple"
          />
        )}

        <div className="home-toolbar__right">
          {!isLoading && (
            <div className="home-sort-bar">
              <ArrowDownUp size={14} className="home-sort-bar__icon" />
              {SORT_FIELDS.map((field) => {
                const isActive = sortField === field.key;
                return (
                  <Button
                    key={field.key}
                    variant="outline"
                    className={
                      isActive
                        ? 'home-sort-btn home-sort-btn--active bg-[#561ce5] hover:bg-[#3d0fa8] text-white! border-[#561ce5] font-normal'
                        : 'home-sort-btn text-[#1a1a2e] font-normal'
                    }
                    onClick={() => {
                      if (isActive) {
                        setSortDir((d) => d * -1);
                      } else {
                        setSortField(field.key);
                        setSortDir(1);
                      }
                    }}
                  >
                    {field.labelFull ? (
                      <>
                        <span className="home-sort-btn__label-full">{field.labelFull}</span>
                        <span className="home-sort-btn__label-short">{field.label}</span>
                      </>
                    ) : (
                      field.label
                    )}{' '}
                    {isActive ? (sortDir === 1 ? '↑' : '↓') : ''}
                  </Button>
                );
              })}
            </div>
          )}
          {isAuthenticated && (
            <Button
              className="bg-[#561ce5] hover:bg-[#3d0fa8] text-white shadow-sm cursor-pointer"
              onClick={() => setAddDialogOpen(true)}
              type="button"
            >
              + Add Company
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="home-card-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : sortedCompanies.length === 0 ? (
        <p className="home-empty">No companies match the current filters.</p>
      ) : (
        <>
          <div
            className="home-card-grid"
            key={`${sortField}-${sortDir}-${safePage}`}
          >
            {paginatedCompanies.map((company) => {
              const canManage =
                user &&
                (user.id === company.createdByUserId || user.role === 'admin');

              return (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onClick={
                    isPendingCompany(company)
                      ? undefined
                      : () => navigate(`/companies/${company.id}`)
                  }
                  onEdit={
                    canManage
                      ? () => {
                          setEditingCompany(company);
                          setAddDialogOpen(true);
                        }
                      : undefined
                  }
                  onDelete={
                    canManage
                      ? () => setCompanyPendingDelete(company)
                      : undefined
                  }
                />
              );
            })}
          </div>
          {totalPages > 1 && (
            <PageNav
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Home;
