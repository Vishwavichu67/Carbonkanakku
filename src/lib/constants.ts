import { ChartPie, Factory, FileText, Gauge, LayoutDashboard, Settings, Users, Droplets, Leaf, Zap, Fan, LayoutGrid, Shirt, PaintBucket, Truck, Recycle, Award, Library, MessageSquare, BrainCircuit } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const siteConfig = {
  name: "CarbonKanakku",
  description: "Empowering Textile Industries for a Greener Tomorrow.",
};

export const mainNav = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Hub", href: "/hub" },
  { title: "About Us", href: "/community" },
];

export const dashboardNav = [
    { title: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Data Input', href: '/dashboard/data-input', icon: FileText },
    { title: 'Analysis', href: '/dashboard/analysis', icon: ChartPie },
    { title: 'Reports', href: '/dashboard/reports', icon: Award },
];

export const whySustainabilityMatters = [
  {
    title: "Global Impact",
    stat: "Contributes up to 10% of global CO₂ emissions.",
    icon: Leaf,
  },
  {
    title: "Water Usage",
    stat: "Responsible for 20% of the world's industrial water pollution.",
    icon: Droplets,
  },
  {
    title: "Energy Consumption",
    stat: "A highly energy-intensive industry, with large potential for savings.",
    icon: Zap,
  },
];

type Subdomain = {
  name: string;
  icon: LucideIcon;
  description: string;
  image: string;
  inputs: { name: string; unit: string; emissionType: string }[];
};

export const subdomains: Subdomain[] = [
  {
    name: "Spinning Units",
    icon: Fan,
    description: "Track power consumption, yarn output, and boiler fuel usage.",
    image: "spinning-units",
    inputs: [
        { name: "Power Consumption", unit: "kWh", emissionType: "Energy" },
        { name: "Yarn Output", unit: "kg", emissionType: "Production" },
        { name: "Boiler Fuel", unit: "liters/kg", emissionType: "Energy" },
    ]
  },
  {
    name: "Weaving Mills",
    icon: LayoutGrid,
    description: "Monitor loom electricity, lubrication, and fabric output.",
    image: "weaving-mills",
    inputs: [
        { name: "Loom Electricity", unit: "kWh", emissionType: "Energy" },
        { name: "Lubrication Oil Used", unit: "liters", emissionType: "Chemical" },
        { name: "Fabric Output", unit: "meters", emissionType: "Production" },
    ]
  },
  {
    name: "Garment Manufacturing",
    icon: Shirt,
    description: "Log machine usage, fabric waste, and transport metrics.",
    image: "garment-manufacturing",
    inputs: [
        { name: "Machine Usage Time", unit: "hours", emissionType: "Energy" },
        { name: "Fabric Waste", unit: "kg", emissionType: "Solid Waste" },
        { name: "Transport Distance", unit: "km", emissionType: "Transport" },
    ]
  },
  {
    name: "Dyeing & Processing",
    icon: PaintBucket,
    description: "Measure water, chemical, and effluent quantities.",
    image: "dyeing-processing",
    inputs: [
        { name: "Water Used", unit: "liters", emissionType: "Water" },
        { name: "Chemical Quantity", unit: "kg", emissionType: "Chemical" },
        { name: "Effluent Volume", unit: "liters", emissionType: "Water" },
    ]
  },
  {
    name: "Packaging & Logistics",
    icon: Truck,
    description: "Analyze transport distance, packaging types, and shipment modes.",
    image: "packaging-logistics",
    inputs: [
        { name: "Truck Distance", unit: "km", emissionType: "Transport" },
        { name: "Packaging Material Weight", unit: "kg", emissionType: "Solid Waste" },
        { name: "Shipment Mode", unit: "Air/Sea/Land", emissionType: "Transport" },
    ]
  },
  {
    name: "Recycling & Waste Units",
    icon: Recycle,
    description: "Quantify waste processed and energy used in recycling.",
    image: "recycling-waste",
    inputs: [
        { name: "Textile Waste Processed", unit: "kg", emissionType: "Recycling" },
        { name: "Energy Used", unit: "kWh", emissionType: "Energy" },
        { name: "By-product Output", unit: "kg", emissionType: "Production" },
    ]
  },
];

export const newsFeed = [
    {
        category: "Carbon Policy Updates",
        title: "India Considers New Carbon Tax for High-Emission Industries",
        summary: "The government is drafting a new policy that could introduce a carbon tax on industries, including textiles, to curb emissions."
    },
    {
        category: "Govt Regulations",
        title: "MSME Green Scheme: Compliance Deadlines Approaching",
        summary: "Small and medium enterprises in the textile sector are reminded to comply with the new Green Scheme regulations by the end of the fiscal year."
    },
    {
        category: "Textile Innovations",
        title: "Breakthrough in Waterless Dyeing Technology",
        summary: "A startup from Bengaluru has developed a new dyeing process that uses 95% less water, promising a revolution in textile processing."
    },
]

export const hubTabs = [
    { value: 'news', label: 'ESG News', icon: FileText },
    { value: 'innovations', label: 'Innovations', icon: Zap },
    { value: 'regulations', label: 'Regulations', icon: Library },
    { value: 'policy', label: 'Carbon Policy', icon: Leaf },
    { value: 'summarizer', label: 'AI Summarizer', icon: BrainCircuit },
]

export const caseStudies = [
    {
        id: '1',
        title: 'Arvind Ltd: Pioneering Water Conservation',
        summary: 'How one of India\'s largest textile mills reduced its water consumption by 30% using advanced recycling technology.',
        image: 'case-study-1',
    },
    {
        id: '2',
        title: 'Welspun India: Journey to 100% Renewable Energy',
        summary: 'Welspun\'s strategic investment in solar and wind power has made its Anjar plant a model for sustainable energy usage.',
        image: 'case-study-2',
    },
    {
        id: '3',
        title: 'Pratibha Syntex: A Circular Economy Champion',
        summary: 'From farm to fashion, Pratibha Syntex has integrated circular principles, turning waste into value and empowering local communities.',
        image: 'case-study-3',
    }
]

export const regulations = [
    {
        title: "Business Responsibility and Sustainability Reporting (BRSR)",
        description: "Mandated by SEBI for the top 1000 listed companies, this framework requires detailed disclosures on Environmental, Social, and Governance (ESG) performance, pushing for greater transparency."
    },
    {
        title: "Water (Prevention and Control of Pollution) Act, 1974",
        description: "A foundational law that governs water pollution. For textile units, especially dyeing and processing, this mandates the treatment of effluents to meet standards set by the Central and State Pollution Control Boards (CPCB & SPCB)."
    },
    {
        title: "Air (Prevention and Control of Pollution) Act, 1981",
        description: "Regulates air emissions from industrial plants. Textile mills must monitor and control emissions from boilers, generators, and other machinery to comply with national air quality standards."
    },
    {
        title: "Perform, Achieve and Trade (PAT) Scheme",
        description: "A market-based mechanism under the National Mission for Enhanced Energy Efficiency (NMEEE) that applies to energy-intensive textile units. It sets energy reduction targets and allows for the trading of energy-saving certificates."
    },
    {
        title: "Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016",
        description: "Governs the handling and disposal of hazardous waste, including chemical sludge from dyeing and processing units, ensuring environmentally safe management."
    },
]
