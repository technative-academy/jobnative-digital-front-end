import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Tag from "../../components/Tag/Tag";
import { useCompany } from "../../hooks/useCompany";
import { getRandomColor } from "../../utils.js";
import { ArrowUpRightIcon } from "lucide-react";

import "./Company.css";

function Comment() {
  return (
    <div className="flex gap-10 p-3">
      <span>
        <div className="text-center">
          <img
            src="/stock-profile-pic.jpg"
            alt="Profile"
            className="h-14 w-14 rounded-full object-cover"
          />
          <p>Danny</p>
        </div>
      </span>
      <span className="min-w-9/12 max-w-11/12">
        <Textarea id="comment-1" disabled defaultValue="I Love this company!" />
      </span>
    </div>
  );
}

const lorem = `Proident ut eiusmod commodo ex fugiat proident irure sint commodo cillum nulla qui consequat. Enim fugiat nostrud id dolor fugiat ad culpa occaecat mollit ullamco qui enim quis. Ad labore officia do aliqua mollit ipsum nulla voluptate et. Dolore commodo Lorem ut non quis aute ex cillum adipisicing culpa quis non.
Commodo occaecat ea sunt aliqua pariatur exercitation enim nisi. Laboris officia officia aliquip culpa excepteur nostrud occaecat sint ullamco. Laborum nulla mollit tempor aute dolore enim. Cillum nisi irure anim cupidatat esse pariatur ipsum. Cupidatat excepteur sunt do reprehenderit adipisicing elit est proident aliquip laboris reprehenderit consectetur. Excepteur consectetur sunt et ex et sint nulla veniam ad culpa pariatur. Amet consectetur elit culpa id.

Pariatur duis fugiat tempor ea quis in esse voluptate veniam et. Sunt incididunt Lorem laborum ipsum anim fugiat amet ex incididunt eu. Duis quis nostrud irure sit nisi ad. Ipsum anim enim exercitation dolor nostrud sunt laborum minim consequat culpa. Sit labore sit qui sunt aute. Deserunt do aliqua ad id id eiusmod sint.

Non irure laboris fugiat magna nulla sint culpa. Pariatur et laboris amet qui est consequat exercitation anim fugiat consequat nisi. Cillum nisi nostrud anim consequat culpa nostrud fugiat id. Commodo elit excepteur cillum fugiat nostrud minim. Dolor dolor veniam qui exercitation laboris mollit nostrud irure voluptate cupidatat eu et cupidatat minim.

Mollit dolore ut adipisicing veniam id aliqua pariatur mollit nostrud. Cillum sit est exercitation et consequat sit. Cupidatat quis est aute elit nisi dolore fugiat laborum aute voluptate. Et sit aute sit Lorem sunt veniam minim ex adipisicing nisi. Proident nisi voluptate incididunt consectetur enim. Amet aute velit minim ipsum cupidatat nisi tempor nostrud occaecat ea. Velit consequat pariatur nulla pariatur consequat ut aliqua sit amet minim.`;

function Company({ open, onOpenChange, companyId }) {
  const { data, isLoading, error } = useCompany(companyId);
  console.log(data);

  return (
    // TODO add functionality for this to be opened from the main page
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Company</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] min-w-11/12 overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{data?.name}</DialogTitle>
              {/* change below to use a select component */}
              <div className="text-sm mr-35 capitalize">
                Status: {data?.status}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                asChild
                className="text-muted-foreground w-fit h-fit inline-flex items-center gap-1 leading-none hover:scale-110 transition-transform duration-150"
                size="sm"
              >
                <a href={data?.website} target="_blank">
                  Website <ArrowUpRightIcon />
                </a>
              </Button>
              <a
                href={data?.linkedin}
                className="card__link card__link--linkedin"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  className="card__link-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  aria-hidden="true"
                >
                  <path d="M512 96L127.9 96C110.3 96 96 110.5 96 128.3L96 511.7C96 529.5 110.3 544 127.9 544L512 544C529.6 544 544 529.5 544 511.7L544 128.3C544 110.5 529.6 96 512 96zM231.4 480L165 480L165 266.2L231.5 266.2L231.5 480L231.4 480zM198.2 160C219.5 160 236.7 177.2 236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160zM480.3 480L413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480z" />
                </svg>
              </a>
            </div>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
          </DialogHeader>
          <FieldGroup>
            <Field>
              <div>
                Tech:
                {data?.technologies.map((tech) => {
                  return <Tag text={tech.name} colour={getRandomColor()} />;
                })}
                {/* <Tag text="React" colour="lightblue" />
                <Tag text="JavaScript" colour="yellow" />
                <Tag text="TypeScript" colour="lightblue" /> */}
              </div>
            </Field>
            <Field>
              <div>
                Industry:
                <Tag text={data?.industry} colour="lightpink" />
              </div>
            </Field>
            <Field>
              <div>
                Job Roles:
                {data?.jobRoles.map((job) => {
                  return <Tag text={job} colour={getRandomColor()} />;
                })}
              </div>
            </Field>
            <Field>
              {/* <Label className="text-base">Location:</Label> */}
              <div>Location: {data?.location}</div>
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              {/* <Input id="username-1" name="username" placeholder="Enter a desription for this company" /> */}
              <Textarea
                id="description"
                className="min-h-30 max-h-60"
                disabled
                defaultValue={data?.description}
                placeholder="Enter a desription for this company"
              />
            </Field>

            <Field>
              <Label htmlFor="comments">Comments</Label>
              {/* <Input id="username-1" name="username" placeholder="Enter a desription for this company" /> */}
              <div className="max-h-40 space-y-4 overflow-y-scroll rounded-md border-2 border-muted/70 pr-3">
                <Comment />
                <Comment />
                <Comment />
                <Comment />
              </div>
            </Field>

            <Field>
              <Label htmlFor="add-comment">Add Comment:</Label>
              {/* <Input id="username-1" name="username" placeholder="Enter a desription for this company" /> */}
              <div className="flex flex-col justify-end max-w-8/12">
                <Textarea
                  id="add-comment"
                  className="mb-2"
                  placeholder="Type comment here"
                />
                <Button
                  type="submit"
                  className="max-w-2/12 min-w-3/24 self-end"
                >
                  Submit
                </Button>
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default Company;
