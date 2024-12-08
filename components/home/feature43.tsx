import {
BarChartHorizontal,
BatteryCharging,
CircleHelp,
Layers,
WandSparkles,
ZoomIn,
} from 'lucide-react';

const reasons = [
{
    title: 'Built by JT Users',
    description:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe est aliquid exercitationem, quos explicabo repellat?',
    icon: <ZoomIn className="size-6" />,
},
{
    title: 'Easy to Use',
    description:
    'Just add your JobTread API key and let us do the rest.',
    icon: <BarChartHorizontal className="size-6" />,
},
{
    title: 'Prebuilt Templates',
    description:
    "We're creating the industry's best dashboards, automations, and library of resources ready for you to use.",
    icon: <CircleHelp className="size-6" />,
},
{
    title: 'Real Time Data',
    description:
    'We pull your data from JobTread in real time, so you always have the latest information.',
    icon: <WandSparkles className="size-6" />,
},
{
    title: 'JT Companion',
    description:
    'Built specifically for JT users, alongside the JT team, to bring you the best companion app possible.',
    icon: <Layers className="size-6" />,
},
{
    title: 'Less Time Wrestling with Data',
    description:
    'Spend more time on your business, less time on spreadsheets and Zapier.',
    icon: <BatteryCharging className="size-6" />,
},
];

const Feature43 = () => {
return (
    <section className="py-8 w-full">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 md:mb-20">
        <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            Why Work With Us?
        </h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {reasons.map((reason, i) => (
            <div key={i} className="flex flex-col">
            <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-accent">
                {reason.icon}
            </div>
            <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
            <p className="text-muted-foreground">{reason.description}</p>
            </div>
        ))}
        </div>
    </div>
    </section>
);
};

export default Feature43;
