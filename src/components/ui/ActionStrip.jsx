import {
  Receipt,
  CircleDollarSign,
  BarChart3
} from 'lucide-react';

function ActionStrip({

  onAddExpense,

  onAddIncome,

  onOpenReports,

}) {

  const actions = [

    {
      title: 'Gasto',
      icon: <Receipt size={22} />,
      action: onAddExpense,
      color: 'bg-red-50 text-red-600',
    },

    {
      title: 'Ingreso',
      icon: <CircleDollarSign size={22} />,
      action: onAddIncome,
      color: 'bg-emerald-50 text-emerald-600',
    },

    {
      title: 'Informes',
      icon: <BarChart3 size={22} />,
      action: onOpenReports,
      color: 'bg-pink-50 text-primary',
    },

  ];

  return (

    <div className="grid grid-cols-3 gap-3">

      {

        actions.map(item => (

          <button

            key={item.title}

            onClick={item.action}

            className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-100 active:scale-95 transition"

          >

            <div

              className={`
                w-12
                h-12
                mx-auto
                rounded-2xl
                flex
                items-center
                justify-center

                ${item.color}
              `}

            >

              {item.icon}

            </div>

            <p className="mt-3 text-sm font-bold">

              {item.title}

            </p>

          </button>

        ))

      }

    </div>

  );

}

export default ActionStrip;