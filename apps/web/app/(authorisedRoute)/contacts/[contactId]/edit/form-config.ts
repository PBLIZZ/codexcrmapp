// Form field interface
export interface FormFieldConfig {
  id: string;
  label: string;
  type?: string;
  className?: string;
  required?: boolean;
  rows?: number;
}

// Form section interface
export interface FormSectionConfig {
  title: string;
  fields: FormFieldConfig[];
}

// Form sections configuration
export const FORM_SECTIONS: FormSectionConfig[] = [
  {
    title: "Contact Information",
    fields: [
      {
        id: "full_name",
        label: "Full Name",
        required: true,
        className: "sm:col-span-6"
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        required: true,
        className: "sm:col-span-3"
      },
      {
        id: "phone",
        label: "Phone",
        className: "sm:col-span-3"
      },
      {
        id: "phone_country_code",
        label: "Phone Country Code",
        className: "sm:col-span-3"
      }
    ]
  },
  {
    title: "Professional Details",
    fields: [
      {
        id: "company_name",
        label: "Company",
        className: "sm:col-span-3"
      },
      {
        id: "job_title",
        label: "Job Title",
        className: "sm:col-span-3"
      },
      {
        id: "website",
        label: "Website",
        className: "sm:col-span-full"
      }
    ]
  },
  {
    title: "Address",
    fields: [
      {
        id: "address_street",
        label: "Street address",
        className: "col-span-full"
      },
      {
        id: "address_city",
        label: "City",
        className: "sm:col-span-2 sm:col-start-1"
      },
      {
        id: "address_postal_code",
        label: "ZIP / Postal code",
        className: "sm:col-span-2"
      },
      {
        id: "address_country",
        label: "Country",
        className: "sm:col-span-2"
      }
    ]
  },
  {
    title: "Other Information",
    fields: [
      {
        id: "source",
        label: "Source",
        className: "sm:col-span-3"
      },
      {
        id: "last_contacted_at",
        label: "Last Contacted At",
        type: "datetime-local",
        className: "sm:col-span-3"
      }
    ]
  }
];