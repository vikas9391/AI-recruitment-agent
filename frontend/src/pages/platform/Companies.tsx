import { useEffect, useState } from "react";
import { Building2, Plus, Users, X } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Alert } from "../../components/ui/Alert";
import { Table } from "../../components/ui/Table";
import {
  createTenant,
  listTenants,
  type CreateTenantPayload,
  type Tenant,
} from "../../lib/authApi";
import { getApiErrorMessage } from "../../lib/apiClient";

const emptyForm: CreateTenantPayload = {
  company_name: "",
  company_email: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};

export default function PlatformCompanies() {
  const [tenants, setTenants] = useState<Tenant[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateTenantPayload>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadTenants() {
    try {
      const data = await listTenants();
      setTenants(data);
      setLoadError(null);
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "Could not load companies."));
    }
  }

  useEffect(() => {
    loadTenants();
  }, []);

  function handleChange(field: keyof CreateTenantPayload, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    try {
      const result = await createTenant(form);
      setSuccessMessage(
        `${result.company.company_name} was created with ${result.admin.email} as HR Admin.`
      );
      setForm(emptyForm);
      setShowForm(false);
      await loadTenants();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Could not create the company."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout pageTitle="Platform Admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-ink">Tenant Companies</h1>
            <p className="text-sm text-ink-secondary mt-0.5">
              Every company on the platform, and their HR Admin accounts.
            </p>
          </div>
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Onboard Company"}
          </Button>
        </div>

        {successMessage && (
          <Alert variant="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
        )}

        {showForm && (
          <Card>
            <h2 className="text-sm font-semibold text-ink mb-4">New Tenant Company</h2>

            {formError && (
              <div className="mb-4">
                <Alert variant="error" message={formError} onClose={() => setFormError(null)} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  label="Company name"
                  value={form.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  required
                />
                <Input
                  label="Company email"
                  type="email"
                  value={form.company_email}
                  onChange={(e) => handleChange("company_email", e.target.value)}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  label="Admin first name"
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  required
                />
                <Input
                  label="Admin last name"
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  label="Admin email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
                <Input
                  label="Admin password"
                  isPassword
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  hint="Minimum 8 characters. Share this with the new admin securely."
                />
              </div>

              <Button type="submit" isLoading={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Company & Admin"}
              </Button>
            </form>
          </Card>
        )}

        <Card padding="lg">
          {loadError && <Alert variant="error" message={loadError} />}

          {!loadError && tenants === null && (
            <p className="text-sm text-ink-secondary">Loading companies...</p>
          )}

          {!loadError && tenants !== null && tenants.length === 0 && (
            <p className="text-sm text-ink-secondary">No companies yet.</p>
          )}

          {!loadError && tenants !== null && tenants.length > 0 && (
            <Table<Tenant>
              rowKey={(row) => row.id}
              data={tenants}
              columns={[
                {
                  key: "company_name",
                  header: "Company",
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <Building2 size={15} className="text-ink-secondary shrink-0" />
                      <span className="font-medium">{row.company_name}</span>
                    </div>
                  ),
                },
                {
                  key: "company_email",
                  header: "Email",
                  render: (row) => row.company_email,
                },
                {
                  key: "employee_count",
                  header: "Users",
                  render: (row) => (
                    <span className="inline-flex items-center gap-1">
                      <Users size={14} className="text-ink-secondary" />
                      {row.employee_count}
                    </span>
                  ),
                },
                {
                  key: "created_at",
                  header: "Created",
                  render: (row) => new Date(row.created_at).toLocaleDateString(),
                },
              ]}
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
