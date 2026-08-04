import {
  Sparkles,
  ChevronRight
} from 'lucide-react';

import Card from './Card';

function RecommendationCard({

  title,

  description,

  action,

}) {

  return (

    <Card>

      <div className="flex gap-4">

        <div
          className="
            w-14
            h-14

            rounded-2xl

            bg-gradient-to-br
            from-pink-500
            to-fuchsia-500

            flex
            items-center
            justify-center

            text-white

            shrink-0
          "
        >
          <Sparkles size={22}/>
        </div>

        <div className="flex-1">

          <h3
            className="
              text-lg
              font-black
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-zinc-500
            "
          >
            {description}
          </p>

          {action && (

            <button
              className="
                mt-5

                inline-flex
                items-center
                gap-2

                text-primary
                font-bold
              "
            >

              {action}

              <ChevronRight
                size={18}
              />

            </button>

          )}

        </div>

      </div>

    </Card>

  );

}

export default RecommendationCard;