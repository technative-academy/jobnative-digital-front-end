import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Tag from "../../components/Tag/Tag"

function Comment() {
    return(
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
                <Textarea id="comment-1" disabled defaultValue="I Love this company!"/>
            </span>
        </div>
    )
}

const lorem = `Proident ut eiusmod commodo ex fugiat proident irure sint commodo cillum nulla qui consequat. Enim fugiat nostrud id dolor fugiat ad culpa occaecat mollit ullamco qui enim quis. Ad labore officia do aliqua mollit ipsum nulla voluptate et. Dolore commodo Lorem ut non quis aute ex cillum adipisicing culpa quis non.
Commodo occaecat ea sunt aliqua pariatur exercitation enim nisi. Laboris officia officia aliquip culpa excepteur nostrud occaecat sint ullamco. Laborum nulla mollit tempor aute dolore enim. Cillum nisi irure anim cupidatat esse pariatur ipsum. Cupidatat excepteur sunt do reprehenderit adipisicing elit est proident aliquip laboris reprehenderit consectetur. Excepteur consectetur sunt et ex et sint nulla veniam ad culpa pariatur. Amet consectetur elit culpa id.

Pariatur duis fugiat tempor ea quis in esse voluptate veniam et. Sunt incididunt Lorem laborum ipsum anim fugiat amet ex incididunt eu. Duis quis nostrud irure sit nisi ad. Ipsum anim enim exercitation dolor nostrud sunt laborum minim consequat culpa. Sit labore sit qui sunt aute. Deserunt do aliqua ad id id eiusmod sint.

Non irure laboris fugiat magna nulla sint culpa. Pariatur et laboris amet qui est consequat exercitation anim fugiat consequat nisi. Cillum nisi nostrud anim consequat culpa nostrud fugiat id. Commodo elit excepteur cillum fugiat nostrud minim. Dolor dolor veniam qui exercitation laboris mollit nostrud irure voluptate cupidatat eu et cupidatat minim.

Mollit dolore ut adipisicing veniam id aliqua pariatur mollit nostrud. Cillum sit est exercitation et consequat sit. Cupidatat quis est aute elit nisi dolore fugiat laborum aute voluptate. Et sit aute sit Lorem sunt veniam minim ex adipisicing nisi. Proident nisi voluptate incididunt consectetur enim. Amet aute velit minim ipsum cupidatat nisi tempor nostrud occaecat ea. Velit consequat pariatur nulla pariatur consequat ut aliqua sit amet minim.`

function Company() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Company</Button>
        </DialogTrigger>
  <DialogContent className="max-h-[85vh] min-w-10/12 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Company Title</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
          </DialogHeader>
          <FieldGroup>
            <Field>
                <div>
                    Tech:
                    <Tag text="React" colour="lightblue"/>
                    <Tag text="JavaScript" colour="yellow"/>
                    <Tag text="TypeScript" colour="lightblue"/>
                </div>
            </Field>
            <Field>
                <div>
                    Sector:
                    <Tag text="Healthcare" colour="lightpink"/>
                </div>
            </Field>
            <Field>
                {/* <Label className="text-base">Location:</Label> */}
                <div>
                   Location:  Sussex, UK
                </div>
            </Field>
            <Field >
              <Label htmlFor="description">Description</Label>
              {/* <Input id="username-1" name="username" placeholder="Enter a desription for this company" /> */}
              <Textarea  id="description" className="min-h-30 max-h-60" disabled defaultValue={lorem} placeholder="Enter a desription for this company"/>
            </Field>

            <Field>
              <Label htmlFor="comments">Comments</Label>
              {/* <Input id="username-1" name="username" placeholder="Enter a desription for this company" /> */}
              <div className="max-h-40 space-y-4 overflow-y-scroll rounded-md border-2 border-muted/70 pr-3">
                <Comment/>
                <Comment/>
                <Comment/>
                <Comment/>
              </div>
            </Field>

            <Field>
              <Label htmlFor="add-comment">Add Comment:</Label>
              {/* <Input id="username-1" name="username" placeholder="Enter a desription for this company" /> */}
              <div className="flex flex-col justify-end max-w-8/12">
                <Textarea  id="add-comment" className="mb-2" placeholder="Type comment here"/>
                <Button type="submit" className="max-w-2/12 min-w-3/24 self-end">Submit</Button>
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
  )
}

export default Company;
