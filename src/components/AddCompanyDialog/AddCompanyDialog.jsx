import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import TagInput from '../TagInput/TagInput';
import { useCreateCompany } from '../../hooks/useCreateCompany';
import { useUpdateCompany } from '../../hooks/useUpdateCompany';
import './AddCompanyDialog.css';

const LOCATION_OPTIONS = [
  'Brighton',
  'London',
  'London / Brighton',
  'Hove',
  'Lewes',
  'Crawley',
  'Horsham',
  'Worthing',
  'Burgess Hill',
  'Haywards Heath',
  'Portsmouth',
  'Falmer',
  'Southwick',
  'Peacehaven',
  'Battle',
  'Sussex',
  'Remote',
  'Other',
];
const INDUSTRY_OPTIONS = [
  'Software Development',
  'Web and app agency',
  'Fintech & Financial Services',
  'Data, AI & Machine Learning',
  'Cybersecurity & IT Infrastructure',
  'Healthtech & Biotechnology',
  'E-commerce & Retail',
  'Game Development & Media',
  'Manufacturing & Engineering',
  'Public Sector & Education',
  'Other',
];

const JOB_ROLE_OPTIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Engineer',
  'Software Engineer',
  'DevOps Engineer',
  'UX Designer',
  'Product Manager',
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

function showMutationSuccess(title, description) {
  toast.success(title, { description, style: successToastStyle });
}

function showMutationError(title, description) {
  toast.error(title, { description, style: errorToastStyle });
}

function getInitialFormState(company) {
  const techs = (company?.technologies || company?.technologyStack || [])
    .map((item) => (typeof item === 'string' ? item : item?.name))
    .filter(Boolean);

  const roles = (company?.jobRoles || company?.jobRoleTags || [])
    .map((item) => (typeof item === 'string' ? item : item?.name))
    .filter(Boolean);

  return {
    name: company?.name || '',
    location: company?.location || '',
    industry: company?.industry || '',
    techStack: techs,
    jobRoles: roles,
    website: company?.website || '',
    linkedin: company?.linkedin || '',
    description: company?.description || '',
    fieldErrors: {},
  };
}

function CompanyFormContent({
  company,
  isEditMode,
  isCreating,
  isUpdating,
  isSubmitting,
  onOpenChange,
  createCompany,
  updateCompany,
}) {
  const initial = getInitialFormState(company);
  const [name, setName] = useState(initial.name);
  const [location, setLocation] = useState(initial.location);
  const [industry, setIndustry] = useState(initial.industry);
  const [techStack, setTechStack] = useState(initial.techStack);
  const [jobRoles, setJobRoles] = useState(initial.jobRoles);
  const [website, setWebsite] = useState(initial.website);
  const [linkedin, setLinkedin] = useState(initial.linkedin);
  const [description, setDescription] = useState(initial.description);
  const [fieldErrors, setFieldErrors] = useState(initial.fieldErrors);

  function clearFieldError(fieldName) {
    setFieldErrors((current) => {
      if (!current[fieldName]) return current;
      const next = { ...current };
      delete next[fieldName];
      return next;
    });
  }

  function resetForm() {
    setName('');
    setLocation('');
    setIndustry('');
    setTechStack([]);
    setJobRoles([]);
    setWebsite('');
    setLinkedin('');
    setDescription('');
    setFieldErrors({});
  }

  function validateForm() {
    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.name = 'Company name is required.';
    }
    if (!location) {
      nextErrors.location = 'Location is required.';
    }
    return nextErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    const payload = {
      name: name.trim(),
      location: location.trim() || null,
      industry: industry.trim() || null,
      technologyStack: techStack,
      jobRoles: jobRoles,
      website: website.trim() || null,
      linkedin: linkedin.trim() || null,
      description: description.trim() || null,
    };

    try {
      if (isEditMode) {
        await updateCompany({ id: company.id, payload });
        showMutationSuccess('Company updated', `${payload.name} has been saved.`);
      } else {
        await createCompany(payload);
        showMutationSuccess(
          'Company submitted',
          `${payload.name} is now awaiting review.`,
        );
      }
      resetForm();
      onOpenChange(false);
    } catch (submitError) {
      showMutationError(
        isEditMode ? 'Could not update company' : 'Could not create company',
        submitError?.message || 'Check your details and try again.',
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="add-co__form">
      <div className="add-co__header">
        <div className="add-co__header-copy">
          <span className="add-co__eyebrow">
            {isEditMode ? 'Edit company' : 'Add company'}
          </span>
          <DialogTitle className="add-co__title">
            {isEditMode ? 'Edit Company' : 'Add a new company'}
          </DialogTitle>
        </div>
        <button
          type="button"
          className="add-co__close-x"
          onClick={() => {
            if (!isSubmitting) onOpenChange(false);
          }}
          disabled={isSubmitting}
          aria-label="Close company form"
        >
          <X size={16} />
        </button>
      </div>

      <div className="add-co__body">
        <section className="add-co__section">
          <div className="add-co__section-head">
            <h3 className="add-co__section-title">Company details</h3>
            <p className="add-co__section-copy">
              Start with the basic company information.
            </p>
          </div>

          <div className="add-co__group">
            <label className="add-co__label" htmlFor="company-name">
              Company Name <span className="add-co__required">*</span>
            </label>
            <Input
              id="company-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError('name');
              }}
              className={fieldErrors.name ? 'add-co__control--invalid' : ''}
              placeholder="e.g. TechNative"
            />
            {fieldErrors.name ? (
              <p className="add-co__field-error">{fieldErrors.name}</p>
            ) : null}
          </div>

          <div className="add-co__form-row">
            <div className="add-co__group">
              <label className="add-co__label" htmlFor="company-location">
                Location <span className="add-co__required">*</span>
              </label>
              <Select
                value={location || undefined}
                onValueChange={(value) => {
                  setLocation(value);
                  clearFieldError('location');
                }}
              >
                <SelectTrigger
                  id="company-location"
                  className={`add-co__select-trigger ${fieldErrors.location ? 'add-co__control--invalid' : ''}`}
                >
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="add-co__select-content">
                  {LOCATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.location ? (
                <p className="add-co__field-error">{fieldErrors.location}</p>
              ) : null}
            </div>

            <div className="add-co__group">
              <label className="add-co__label" htmlFor="company-industry">
                Industry
              </label>
              <Select
                value={industry || undefined}
                onValueChange={setIndustry}
              >
                <SelectTrigger
                  id="company-industry"
                  className="add-co__select-trigger"
                >
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="add-co__select-content">
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="add-co__section">
          <div className="add-co__section-head">
            <h3 className="add-co__section-title">Tech & roles</h3>
            <p className="add-co__section-copy">
              What technologies and job roles are relevant?
            </p>
          </div>

          <div className="add-co__group">
            <label className="add-co__label">Tech Stack</label>
            <TagInput
              value={techStack}
              onChange={setTechStack}
              placeholder="Add technology..."
            />
          </div>

          <div className="add-co__group">
            <label className="add-co__label">Job Roles</label>
            <TagInput
              value={jobRoles}
              onChange={setJobRoles}
              options={JOB_ROLE_OPTIONS}
              placeholder="Add job role..."
            />
            <p className="add-co__hint">Press Enter to add a role</p>
          </div>
        </section>

        <section className="add-co__section">
          <div className="add-co__section-head">
            <h3 className="add-co__section-title">Links & description</h3>
          </div>

          <div className="add-co__form-row">
            <div className="add-co__group">
              <label className="add-co__label" htmlFor="company-website">
                Website URL
              </label>
              <Input
                id="company-website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="add-co__group">
              <label className="add-co__label" htmlFor="company-linkedin">
                LinkedIn URL
              </label>
              <Input
                id="company-linkedin"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/..."
              />
            </div>
          </div>

          <div className="add-co__group">
            <label className="add-co__label" htmlFor="company-description">
              Description
            </label>
            <Textarea
              id="company-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="add-co__textarea"
              placeholder="What does this company do?"
            />
          </div>
        </section>
      </div>

      <div className="add-co__footer">
        <div className="add-co__footer-actions">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="add-co__submit-btn"
          >
            {isEditMode
              ? isUpdating
                ? 'Saving...'
                : 'Save changes'
              : isCreating
                ? 'Submitting...'
                : 'Submit for review'}
          </Button>
        </div>
      </div>
    </form>
  );
}

function AddCompanyDialog({ open, onOpenChange, company }) {
  const isEditMode = Boolean(company);
  const { createCompany, loading: isCreating } = useCreateCompany();
  const { updateCompany, loading: isUpdating } = useUpdateCompany();
  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSubmitting) return;
        onOpenChange(nextOpen);
      }}
    >
      {open ? (
        <DialogContent className="add-co" showCloseButton={false}>
          <CompanyFormContent
            key={company?.id ?? 'new-company'}
            company={company}
            isEditMode={isEditMode}
            isCreating={isCreating}
            isUpdating={isUpdating}
            isSubmitting={isSubmitting}
            onOpenChange={onOpenChange}
            createCompany={createCompany}
            updateCompany={updateCompany}
          />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

export default AddCompanyDialog;
